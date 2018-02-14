__author__ = 'royrusso'


class TestIndices:
    def test_get_index_summary(self, fixture):
        """
        Tests index summary endpoint. All ES versions should return the same keys.

        :param fixture:
        :return:
        """
        fixture.add_all_clusters()

        response = fixture.app.get('/api/indices/%s/_summary' % fixture.cluster_v2_name)

        assert 200 == response.status_code
        res = fixture.get_response_data(response)
        index = res.get('data')[0]
        assert index['docs'] == 155
        assert index['docs_deleted'] == 0
        assert index['health'] == 'yellow'
        assert index['index_name'] == 'cars'
        assert index['state'] == 'open'
        assert index['settings']['number_of_shards'] == 5
        assert index['settings']['number_of_replicas'] == 1

        response = fixture.app.get('/api/indices/%s/_summary' % fixture.cluster_v5_name)

        assert 200 == response.status_code
        res = fixture.get_response_data(response)
        index = res.get('data')[0]
        assert index['docs'] == 155
        assert index['docs_deleted'] == 0
        assert index['health'] == 'yellow'
        assert index['index_name'] == 'cars'
        assert index['state'] == 'open'
        assert index['settings']['number_of_shards'] == 5
        assert index['settings']['number_of_replicas'] == 1

        response = fixture.app.get('/api/indices/%s/_summary' % fixture.cluster_v6_name)

        assert 200 == response.status_code
        res = fixture.get_response_data(response)
        index = res.get('data')[0]
        assert index['docs'] == 155
        assert index['docs_deleted'] == 0
        assert index['health'] == 'yellow'
        assert index['index_name'] == 'cars'
        assert index['state'] == 'open'
        assert index['settings']['number_of_shards'] == 5
        assert index['settings']['number_of_replicas'] == 1

    def test_get_aliases(self, fixture):
        """

        :param fixture:
        :return:
        """
        fixture.clear_aliases()
        fixture.create_aliases()
        defs = fixture.get_index_definitions()

        for index in defs:
            alias_names = [x['alias'] for x in index['aliases']]

            index_name = index['index']
            response = fixture.app.get('/api/indices/%s/%s/_aliases' % (fixture.cluster_v2_name, index_name))

            assert 200 == response.status_code
            res = fixture.get_response_data(response)
            assert len(res['data']) == 2
            data = res['data']
            for row in data:
                assert row['index_name'] == index_name
                assert row['alias'] in alias_names

            response = fixture.app.get('/api/indices/%s/%s/_aliases' % (fixture.cluster_v5_name, index_name))

            assert 200 == response.status_code
            res = fixture.get_response_data(response)
            assert len(res['data']) == 2
            data = res['data']
            for row in data:
                assert row['index_name'] == index_name
                assert row['alias'] in alias_names
            response = fixture.app.get('/api/indices/%s/%s/_aliases' % (fixture.cluster_v5_name, index_name))

            assert 200 == response.status_code
            res = fixture.get_response_data(response)
            assert len(res['data']) == 2
            data = res['data']
            for row in data:
                assert row['index_name'] == index_name
                assert row['alias'] in alias_names
