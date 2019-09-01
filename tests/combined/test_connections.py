__author__ = 'royrusso'

import pytest

pytest_plugins = ["docker_compose"]


@pytest.mark.hq_ops
def test_get_clusters(fixture):
    fixture.clear_all_clusters()

    response = fixture.app.get('/api/clusters')

    assert 200 == response.status_code
    res = fixture.get_response_data(response)
    assert res['data'] == []


@pytest.mark.hq_ops
def test_connect_to_clusters(session_scoped_container_getter, fixture):
    fixture.clear_all_clusters()

    container = session_scoped_container_getter.get('elasticsearch').network_info[0]
    es_cluster_connect = '{"ip": "%s", "port": "%s"}' % (container.hostname, container.host_port)
    response = fixture.app.post('/api/clusters/_connect', data=es_cluster_connect,
                                content_type='application/json')
    assert 201 == response.status_code
    res = fixture.get_response_data(response)
    assert res['data'][0]['cluster_version'].startswith("2")

    response = fixture.app.get('/api/clusters')

    assert 200 == response.status_code
    res = fixture.get_response_data(response)
    assert len(res['data']) == 1


@pytest.mark.hq_ops
def test_delete_connection(session_scoped_container_getter, fixture):
    fixture.add_all_clusters(session_scoped_container_getter, clear_first=True)

    response = fixture.app.get('/api/clusters')

    assert 200 == response.status_code
    res = fixture.get_response_data(response)
    assert len(res['data']) == 1

    # lets deletes a specific version
    for c in res['data']:
        if c['cluster_version'].startswith("2"):
            response = fixture.app.delete('/api/clusters/' + c['cluster_name'] + '/_connect')
            assert 200 == response.status_code
            break

    response = fixture.app.get('/api/clusters')

    assert 200 == response.status_code
    res = fixture.get_response_data(response)
    assert len(res['data']) == 0


@pytest.mark.hq_ops
def test_delete_all_connections(session_scoped_container_getter, fixture):
    fixture.clear_all_clusters()

    container = session_scoped_container_getter.get('elasticsearch').network_info[0]
    es_cluster_connect = '{"ip": "%s", "port": "%s"}' % (container.hostname, container.host_port)
    fixture.app.post('/api/clusters/_connect', data=es_cluster_connect,
                     content_type='application/json')

    response = fixture.app.delete('/api/clusters/_all/_connect')
    assert 200 == response.status_code
    response = fixture.app.get('/api/clusters')

    assert 200 == response.status_code
    res = fixture.get_response_data(response)
    assert len(res['data']) == 0
