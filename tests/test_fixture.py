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
