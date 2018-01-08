__author__ = 'royrusso'

import json


class TestFixture:
    _app = None  # Flask app
    app = None  # Flask test client
    headers = None  # In case we need to pass custom headers

    def __init__(self, config):
        try:
            import factory

            self._app = factory.create_app()
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

        self.app.post('/api/clusters/_connect', data=self.config.ES_V2_CLUSTER, content_type='application/json')
        self.app.post('/api/clusters/_connect', data=self.config.ES_V5_CLUSTER, content_type='application/json')
        self.app.post('/api/clusters/_connect', data=self.config.ES_V6_CLUSTER, content_type='application/json')

    def clear_all_clusters(self):
        response = self.app.delete('/api/clusters/_all/_connect')
        assert 200 == response.status_code
