__author__ = 'royrusso'

import json
import logging

import jmespath
import pytest

LOGGER = logging.getLogger(__name__)
pytest_plugins = ["docker_compose"]


@pytest.mark.es_versions
def test_get_cluster_summary(session_scoped_container_getter, fixture):
    fixture.add_all_clusters(session_scoped_container_getter, clear_first=True)

    response = fixture.app.get('/api/clusters/%s/_summary' % fixture.cluster_name)

    assert 200 == response.status_code
    res = fixture.get_response_data(response)
    assert fixture.has_all_keys(fixture.config.KEYS_CLUSTER_SUMMARY, res['data'][0].keys()) is True


@pytest.mark.es_versions
def test_get_cluster_health(fixture):
    response = fixture.app.get('/api/clusters/%s/_health' % fixture.cluster_name)

    assert 200 == response.status_code
    res = fixture.get_response_data(response)
    assert fixture.has_all_keys(fixture.config.KEYS_CLUSTER_HEALTH, res['data'][0].keys()) is True


@pytest.mark.es_versions
def test_get_cluster_state(fixture):
    response = fixture.app.get('/api/clusters/%s/_state' % fixture.cluster_name)

    assert 200 == response.status_code
    res = fixture.get_response_data(response)
    assert fixture.has_all_keys(fixture.config.KEYS_CLUSTER_STATE, res['data'][0].keys()) is True


@pytest.mark.es_versions
def test_get_cluster_stats(fixture):
    response = fixture.app.get('/api/clusters/%s/_stats' % fixture.cluster_name)

    assert 200 == response.status_code
    res = fixture.get_response_data(response)
    assert fixture.has_all_keys(fixture.config.KEYS_CLUSTER_STATS, res['data'][0].keys()) is True


@pytest.mark.es_versions
def test_get_cluster_pending_tasks(fixture):
    response = fixture.app.get('/api/clusters/%s/_pending_tasks' % fixture.cluster_name)

    assert 200 == response.status_code
    res = fixture.get_response_data(response)
    assert fixture.has_all_keys(fixture.config.KEYS_CLUSTER_PENDING_TASKS, res['data'][0].keys()) is True


@pytest.mark.es_versions
def test_get_cluster_settings(fixture):
    response = fixture.app.get('/api/clusters/%s/_settings' % fixture.cluster_name)

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

    response = fixture.app.put('/api/clusters/%s/_settings' % fixture.cluster_name, data=json.dumps(body))
    assert 200 == response.status_code

    response = fixture.app.get('/api/clusters/%s/_settings' % fixture.cluster_name)
    assert 200 == response.status_code
    res = fixture.get_response_data(response)
    assert jmespath.search("transient.discovery.zen.minimum_master_nodes", res['data'][0]) == "1"
