__author__ = 'royrusso'

import json
import os

import requests


class TestFixture:
    _app = None  # Flask app
    app = None  # Flask test client
    headers = None  # In case we need to pass custom headers

    cluster_v2_name = None
    cluster_v5_name = None
    cluster_v6_name = None

    def __init__(self, config):
        try:
            from elastichq import factory

            self._app = factory.create_app(env='test')
            self.app = self._app.test_client()
            self.config = config

            self.clear_indices()
            self.create_indices()
        except Exception as e:
            raise e

    def __enter__(self):
        return self

    def __exit__(self, type, value, traceback):
        return self

    def get_response_data(self, response):
        return json.loads(response.data.decode('utf-8'))

    def add_all_clusters(self, clear_first=True):
        """
        Adds all clusters to the connection pool. 
        :param clear_first: whether we should delete all existing clusters from the pool
        :return:
        """

        if clear_first is True:
            self.clear_all_clusters()

        response = self.app.post('/api/clusters/_connect', data=self.config.ES_V2_CLUSTER, content_type='application/json')
        self.cluster_v2_name = self.get_response_data(response)['data'][0]['cluster_name']

        response = self.app.post('/api/clusters/_connect', data=self.config.ES_V5_CLUSTER, content_type='application/json')
        self.cluster_v5_name = self.get_response_data(response)['data'][0]['cluster_name']

        response = self.app.post('/api/clusters/_connect', data=self.config.ES_V6_CLUSTER, content_type='application/json')
        self.cluster_v6_name = self.get_response_data(response)['data'][0]['cluster_name']

        # self.create_indices()

    def create_indices(self):
        """
        Creates indices for testing. Applies mapping and populates with test data.
        :return:
        """
        try:
            cur_path = os.path.dirname(__file__)
            test_data_path = os.path.join(cur_path, 'data')
            indices_definitions = json.load(open(os.path.join(test_data_path, 'indices_list.json')))

            for row in indices_definitions:
                index_name = row['index']
                mapping_name = row['data_type']

                print("Creating Index: " + index_name)

                with open(os.path.join(test_data_path, row['mapping_file'])) as data_file:
                    mapping = json.load(data_file)

                headers = {
                    "Content-Type": "application/json",
                    "Accept": "application/json"}

                v2_index_url = "http://" + self.config.ES_V2_HOST + ":" + self.config.ES_V2_PORT + "/" + index_name
                self.http_request(v2_index_url, method='PUT', data=mapping, headers=headers)

                v5_index_url = "http://" + self.config.ES_V5_HOST + ":" + self.config.ES_V5_PORT + "/" + index_name
                self.http_request(v5_index_url, method='PUT', data=mapping, headers=headers)

                v6_index_url = "http://" + self.config.ES_V6_HOST + ":" + self.config.ES_V6_PORT + "/" + index_name
                self.http_request(v6_index_url, method='PUT', data=mapping, headers=headers)

                with open(os.path.join(test_data_path, row['data_file'])) as data_file:
                    data = json.load(data_file)

                for datarow in data:
                    source = json.dumps(datarow)
                    self.http_request(v2_index_url + "/" + mapping_name, method='POST', data=source, headers=headers)
                    self.http_request(v5_index_url + "/" + mapping_name, method='POST', data=source, headers=headers)
                    self.http_request(v6_index_url + "/" + mapping_name, method='POST', data=source, headers=headers)

        except Exception as e:
            print("Failed creating Index: " + str(e))
            raise

    def clear_indices(self):
        """
        Deletes test indices.
        :return:
        """
        cur_path = os.path.dirname(__file__)
        test_data_path = os.path.join(cur_path, 'data')
        indices_definitions = json.load(open(os.path.join(test_data_path, 'indices_list.json')))

        for row in indices_definitions:
            index_name = row['index']

            v2_index_url = "http://" + self.config.ES_V2_HOST + ":" + self.config.ES_V2_PORT + "/" + index_name
            self.http_request(v2_index_url, method='DELETE')

            v5_index_url = "http://" + self.config.ES_V5_HOST + ":" + self.config.ES_V5_PORT + "/" + index_name
            self.http_request(v5_index_url, method='DELETE')

            v6_index_url = "http://" + self.config.ES_V6_HOST + ":" + self.config.ES_V6_PORT + "/" + index_name
            self.http_request(v6_index_url, method='DELETE')

    def clear_all_clusters(self):
        response = self.app.delete('/api/clusters/_all/_connect')
        assert 200 == response.status_code

    def has_all_keys(self, primaries, data_dict, excludes=[]):
        """
        Checks whether the returned json doc contains all keys required. This is used to insure that the endpoints are returning uniform data so the UI doesn't error out, regardless of ES version. 
        
        :param primaries: list of keys to check against
        :param data_dict: dict from DB to check for keys
        :param exclude: exclude checking for this specific key. Some versions will not have the same keys
        :return:
        """
        for key in primaries:
            if key not in data_dict and key not in excludes:
                return False
        return True

    def http_request(self, url, method, **kwargs):
        print('Request[%s]: %s' % (method, url))
        response = requests.request(method, url, **kwargs)
        return response
