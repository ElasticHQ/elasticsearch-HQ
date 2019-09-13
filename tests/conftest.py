#!/usr/bin/env python3

import json
import logging
import os

import pytest
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

from elastichq.config.settings import TestSettings
from elastichq.vendor.elasticsearch import Elasticsearch, helpers
from tests.test_fixture import TestFixture

LOGGER = logging.getLogger(__name__)


@pytest.fixture(scope="session", autouse=True)
def wait_for_api(session_scoped_container_getter):
    """Wait for the api from elasticsearch to become responsive"""
    LOGGER.info("Waiting on API...")
    request_session = requests.Session()
    retries = Retry(total=20,
                    backoff_factor=0.1,
                    status_forcelist=[500, 502, 503, 504])
    request_session.mount('http://', HTTPAdapter(max_retries=retries))

    service = session_scoped_container_getter.get("elasticsearch").network_info[0]
    api_url = "http://%s:%s/" % (service.hostname, service.host_port)
    assert request_session.get(api_url)
    return request_session, api_url


@pytest.fixture(autouse=True)
def ensure_logging_framework_not_altered():
    """
    https://github.com/pytest-dev/pytest/issues/14#issuecomment-521577819
    :return:
    """
    before_handlers = list(LOGGER.handlers)
    yield
    LOGGER.handlers = before_handlers


@pytest.yield_fixture(scope='session')
def fixture(request):
    with TestFixture(TestSettings) as fix:
        yield fix


def http_request(url, method, **kwargs):
    print('Request[%s]: %s' % (method, url))
    response = requests.request(method, url, **kwargs)
    return response


@pytest.yield_fixture(scope='module', autouse=False)
def create_indices(session_scoped_container_getter):
    """
    Creates indices for testing. Applies mapping and populates with test data.
    :return:
    """
    print("******** Creating Indices...")
    try:
        cur_path = os.path.dirname(__file__)
        test_data_path = os.path.join(cur_path, 'data')
        indices_definitions = json.load(open(os.path.join(test_data_path, 'indices_list.json')))

        for row in indices_definitions:  # foreach index
            index_name = row['index']
            mapping_name = row['data_type']

            print("Creating Index: " + index_name)

            with open(os.path.join(test_data_path, row['mapping_file'])) as data_file:
                mapping = json.load(data_file)

            headers = {
                "Content-Type": "application/json",
                "Accept": "application/json"}

            container = session_scoped_container_getter.get('elasticsearch').network_info[0]
            es_cluster_connect = 'http://%s:%s' % (container.hostname, container.host_port)
            index_url = es_cluster_connect + "/" + index_name
            http_request(index_url, method='PUT', data=mapping, headers=headers)

            with open(os.path.join(test_data_path, row['data_file'])) as data_file:
                data = json.load(data_file)

            actions = []
            for datarow in data:
                source = json.dumps(datarow)
                action = {
                    "_index": index_name,
                    "_type": mapping_name,
                    "_op_type": 'index',
                    "doc": json.loads(source)
                }
                actions.append(action)

            ES_CLIENT = Elasticsearch(hosts=[es_cluster_connect])
            helpers.bulk(ES_CLIENT, actions, chunk_size=1000)

            http_request(es_cluster_connect + '/_refresh',
                         method='POST')

    except Exception as e:
        print("Failed creating Index: " + str(e))
        raise


def pytest_sessionstart(session):
    pass


def pytest_sessionfinish(session, exitstatus):
    pass
