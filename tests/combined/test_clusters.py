__author__ = 'royrusso'

import pytest


@pytest.mark.first
def test_get_clusters(fixture):
    response = fixture.app.get('/api/clusters')

    assert 200 == response.status_code
    res = fixture.get_response_data(response)
    assert res == []


def test_connect_to_clusters(fixture):
    response = fixture.app.post('/api/clusters/_connect', data=fixture.config.ES_V2_CLUSTER, content_type='application/json')
    assert 201 == response.status_code
    data = fixture.get_response_data(response)
    assert data['version']['number'].startswith("2")

    response = fixture.app.get('/api/clusters')

    assert 200 == response.status_code
    res = fixture.get_response_data(response)
    assert len(res) == 1

    response = fixture.app.post('/api/clusters/_connect', data=fixture.config.ES_V5_CLUSTER, content_type='application/json')
    assert 201 == response.status_code
    data = fixture.get_response_data(response)
    assert data['version']['number'].startswith("5")

    response = fixture.app.get('/api/clusters')

    assert 200 == response.status_code
    res = fixture.get_response_data(response)
    assert len(res) == 2

    response = fixture.app.post('/api/clusters/_connect', data=fixture.config.ES_V6_CLUSTER, content_type='application/json')
    assert 201 == response.status_code
    data = fixture.get_response_data(response)
    assert data['version']['number'].startswith("6")

    response = fixture.app.get('/api/clusters')

    assert 200 == response.status_code
    res = fixture.get_response_data(response)
    assert len(res) == 3


def test_delete_connection(fixture):
    response = fixture.app.get('/api/clusters')

    assert 200 == response.status_code
    res = fixture.get_response_data(response)
    assert len(res) == 3

    # lets deletes a specific version
    for c in res:
        if c['version']['number'].startswith("6"):
            response = fixture.app.delete('/api/clusters/' + c['cluster_name'] + '/_connect')
            assert 200 == response.status_code
            break

    response = fixture.app.get('/api/clusters')

    assert 200 == response.status_code
    res = fixture.get_response_data(response)
    assert len(res) == 2

    # now add it back
    response = fixture.app.post('/api/clusters/_connect', data=fixture.config.ES_V6_CLUSTER, content_type='application/json')
    assert 201 == response.status_code
    data = fixture.get_response_data(response)
    assert data['version']['number'].startswith("6")

    response = fixture.app.get('/api/clusters')

    assert 200 == response.status_code
    res = fixture.get_response_data(response)
    assert len(res) == 3
