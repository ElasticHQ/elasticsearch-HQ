__author__ = 'royrusso'

import json
import logging

import pytest
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

import jmespath
import pytest

LOGGER = logging.getLogger(__name__)
pytest_plugins = ["docker_compose"]

@pytest.fixture(scope="function")
def wait_for_api(session_scoped_container_getter):
    """Wait for the api from elasticsearch to become responsive"""
    request_session = requests.Session()
    retries = Retry(total=50,
                    backoff_factor=0.1,
                    status_forcelist=[500, 502, 503, 504])
    request_session.mount('http://', HTTPAdapter(max_retries=retries))

    service = session_scoped_container_getter.get("elasticsearch_2_4_6").network_info[0]
    api_url = "http://%s:%s/" % (service.hostname, service.host_port)
    assert request_session.get(api_url)
    return request_session, api_url

@pytest.mark.es_versions
def test_get_cluster_summary(wait_for_api, session_scoped_container_getter, fixture):
    response = fixture.app.get('/api/clusters/%s/_summary' % fixture.cluster_v2_name)

    assert 200 == response.status_code
    res = fixture.get_response_data(response)
    assert fixture.has_all_keys(fixture.config.KEYS_CLUSTER_SUMMARY, res['data'][0].keys()) is True


@pytest.mark.es_versions
def test_get_cluster_health(fixture):
    response = fixture.app.get('/api/clusters/%s/_health' % fixture.cluster_v2_name)

    assert 200 == response.status_code
    res = fixture.get_response_data(response)
    assert fixture.has_all_keys(fixture.config.KEYS_CLUSTER_HEALTH, res['data'][0].keys()) is True


@pytest.mark.es_versions
def test_get_cluster_state(fixture):
    response = fixture.app.get('/api/clusters/%s/_state' % fixture.cluster_v2_name)

    assert 200 == response.status_code
    res = fixture.get_response_data(response)
    assert fixture.has_all_keys(fixture.config.KEYS_CLUSTER_STATE, res['data'][0].keys()) is True


@pytest.mark.es_versions
def test_get_cluster_stats(fixture):
    response = fixture.app.get('/api/clusters/%s/_stats' % fixture.cluster_v2_name)

    assert 200 == response.status_code
    res = fixture.get_response_data(response)
    assert fixture.has_all_keys(fixture.config.KEYS_CLUSTER_STATS, res['data'][0].keys()) is True


@pytest.mark.es_versions
def test_get_cluster_pending_tasks(fixture):
    response = fixture.app.get('/api/clusters/%s/_pending_tasks' % fixture.cluster_v2_name)

    assert 200 == response.status_code
    res = fixture.get_response_data(response)
    assert fixture.has_all_keys(fixture.config.KEYS_CLUSTER_PENDING_TASKS, res['data'][0].keys()) is True


@pytest.mark.es_versions
def test_get_cluster_settings(fixture):
    response = fixture.app.get('/api/clusters/%s/_settings' % fixture.cluster_v2_name)

    assert 200 == response.status_code
    res = fixture.get_response_data(response)
    assert fixture.has_all_keys(fixture.config.KEYS_CLUSTER_SETTINGS, res['data'][0].keys()) is True


@pytest.mark.es_versions
def test_put_cluster_settings(fixture):
    body = {
        "transient": {
            "discovery.zen.minimum_master_nodes": 1
        }
    }

    response = fixture.app.put('/api/clusters/%s/_settings' % fixture.cluster_v2_name, data=json.dumps(body))
    assert 200 == response.status_code

    response = fixture.app.get('/api/clusters/%s/_settings' % fixture.cluster_v2_name)
    assert 200 == response.status_code
    res = fixture.get_response_data(response)
    assert jmespath.search("transient.discovery.zen.minimum_master_nodes", res['data'][0]) == "1"
