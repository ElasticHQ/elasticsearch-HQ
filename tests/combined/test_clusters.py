__author__ = 'royrusso'


class TestCluster:
    def test_get_clusters(cls, fixture):
        fixture.clear_all_clusters()

        response = fixture.app.get('/api/clusters')

        assert 200 == response.status_code
        res = fixture.get_response_data(response)
        assert res['data'] == []

    def test_connect_to_clusters(cls, fixture):
        fixture.clear_all_clusters()

        response = fixture.app.post('/api/clusters/_connect', data=fixture.config.ES_V2_CLUSTER, content_type='application/json')
        assert 201 == response.status_code
        res = fixture.get_response_data(response)
        assert res['data'][0]['version']['number'].startswith("2")

        response = fixture.app.get('/api/clusters')

        assert 200 == response.status_code
        res = fixture.get_response_data(response)
        assert len(res['data']) == 1

        response = fixture.app.post('/api/clusters/_connect', data=fixture.config.ES_V5_CLUSTER, content_type='application/json')
        assert 201 == response.status_code
        res = fixture.get_response_data(response)
        assert res['data'][0]['version']['number'].startswith("5")

        response = fixture.app.get('/api/clusters')

        assert 200 == response.status_code
        res = fixture.get_response_data(response)
        assert len(res['data']) == 2

        response = fixture.app.post('/api/clusters/_connect', data=fixture.config.ES_V6_CLUSTER, content_type='application/json')
        assert 201 == response.status_code
        res = fixture.get_response_data(response)
        assert res['data'][0]['version']['number'].startswith("6")

        response = fixture.app.get('/api/clusters')

        assert 200 == response.status_code
        res = fixture.get_response_data(response)
        assert len(res['data']) == 3

    def test_delete_connection(cls, fixture):
        fixture.add_all_clusters(clear_first=True)

        response = fixture.app.get('/api/clusters')

        assert 200 == response.status_code
        res = fixture.get_response_data(response)
        assert len(res['data']) == 3

        # lets deletes a specific version
        for c in res['data']:
            if c['version']['number'].startswith("6"):
                response = fixture.app.delete('/api/clusters/' + c['cluster_name'] + '/_connect')
                assert 200 == response.status_code
                break

        response = fixture.app.get('/api/clusters')

        assert 200 == response.status_code
        res = fixture.get_response_data(response)
        assert len(res['data']) == 2

        # now add it back
        response = fixture.app.post('/api/clusters/_connect', data=fixture.config.ES_V6_CLUSTER, content_type='application/json')
        assert 201 == response.status_code
        res = fixture.get_response_data(response)
        assert res['data'][0]['version']['number'].startswith("6")

        response = fixture.app.get('/api/clusters')

        assert 200 == response.status_code
        res = fixture.get_response_data(response)
        assert len(res['data']) == 3

    def test_delete_all_connections(cls, fixture):
        fixture.clear_all_clusters()

        fixture.app.post('/api/clusters/_connect', data=fixture.config.ES_V2_CLUSTER, content_type='application/json')
        fixture.app.post('/api/clusters/_connect', data=fixture.config.ES_V5_CLUSTER, content_type='application/json')
        fixture.app.post('/api/clusters/_connect', data=fixture.config.ES_V6_CLUSTER, content_type='application/json')
        response = fixture.app.delete('/api/clusters/_all/_connect')
        assert 200 == response.status_code
        response = fixture.app.get('/api/clusters')

        assert 200 == response.status_code
        res = fixture.get_response_data(response)
        assert len(res['data']) == 0
