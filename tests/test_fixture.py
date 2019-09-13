__author__ = 'royrusso'

import json
import logging
import os

import requests

LOGGER = logging.getLogger(__name__)
pytest_plugins = ["docker_compose"]


class TestFixture:
    _app = None  # Flask app
    app = None  # Flask test client
    headers = None  # In case we need to pass custom headers
    cluster_name = 'elasticsearch'
    indices_definitions = None

    def __init__(self, config):
        try:
            from elastichq import create_app
            self._app = create_app(env='test')
            self.app = self._app.test_client()
            self.config = config
            self.indices_definitions = self.get_index_definitions()

        except Exception as e:
            raise e

    def __enter__(self):
        return self

    def __exit__(self, type, value, traceback):
        return self

    def get_response_data(self, response):
        return json.loads(response.data.decode('utf-8'))

    def add_all_clusters(self, session_scoped_container_getter, clear_first=False):
        """
        Adds all clusters to the connection pool. This insures that connections exist at every test method.

        :param clear_first: whether we should delete all existing clusters from the pool
        :return:
        """

        if clear_first is True:
            self.clear_all_clusters()

        container = session_scoped_container_getter.get('elasticsearch').network_info[0]
        es_cluster_connect = '{"ip": "%s", "port": "%s"}' % (container.hostname, container.host_port)

        response = self.app.post('/api/clusters/_connect', data=es_cluster_connect,
                                 content_type='application/json')
        self.cluster_name = self.get_response_data(response)['data'][0]['cluster_name']

    def get_index_definitions(self):
        cur_path = os.path.dirname(__file__)
        test_data_path = os.path.join(cur_path, 'data')
        return json.load(open(os.path.join(test_data_path, 'indices_list.json')))

    def clear_indices(self):
        """
        Deletes test indices.
        :return:
        """

        for row in self.indices_definitions:
            v2_index_url = self.config.ES_V2_CLUSTER_URL + "/_all"
            self.http_request(v2_index_url, method='DELETE')

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

    def clear_aliases(self, es_url):
        indices_definitions = self.indices_definitions

        for row in indices_definitions:  # foreach index
            index_name = row['index']
            aliases = row['aliases']
            for alias in aliases:
                v2_index_alias_url = es_url + "/" + index_name + "/_alias/" + alias['alias']
                self.http_request(v2_index_alias_url, method='DELETE')

    def create_aliases(self, es_url):
        indices_definitions = self.indices_definitions

        for row in indices_definitions:  # foreach index
            index_name = row['index']
            aliases = row['aliases']
            for alias in aliases:
                actions = {"actions": [{"add": {"index": index_name, "alias": alias['alias']}}]}

                v2_index_alias_url = es_url + "/_aliases"
                self.http_request(v2_index_alias_url, method='POST', data=json.dumps(actions))
