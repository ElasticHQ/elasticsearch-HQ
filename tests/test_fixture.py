__author__ = 'royrusso'

import json


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

            self._app = factory.create_app(test=True)
            self.app = self._app.test_client()
            self.config = config
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
