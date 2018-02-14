__author__ = 'royrusso'


class TestNodes:
    def test_get_nodes_summary(self, fixture):
        """
        Tests nodes summary endpoint. All ES versions should return the same keys.

        :param fixture:
        :return:
        """
        fixture.add_all_clusters()

        response = fixture.app.get('/api/nodes/%s/_summary' % fixture.cluster_v2_name)

        assert 200 == response.status_code
        res = fixture.get_response_data(response)
        node = res.get('data')[0]
        assert node['host'] == '127.0.0.1'
        assert node['is_data_node'] == True
        assert node['is_master_node'] == True
        # assert fixture.has_all_keys(fixture.config.KEYS_NODE_SUMMARY_FS, node['fs'].keys()) is True
        # assert fixture.has_all_keys(fixture.config.KEYS_NODE_SUMMARY_JVM, node['jvm'].keys()) is True

        response = fixture.app.get('/api/nodes/%s/_summary' % fixture.cluster_v5_name)

        assert 200 == response.status_code
        res = fixture.get_response_data(response)
        node = res.get('data')[0]
        assert node['host'] == '127.0.0.1'
        assert node['is_data_node'] == True
        assert node['is_master_node'] == True
        # assert fixture.has_all_keys(fixture.config.KEYS_NODE_SUMMARY_FS, node['fs'].keys()) is True
        # assert fixture.has_all_keys(fixture.config.KEYS_NODE_SUMMARY_JVM, node['jvm'].keys()) is True

        response = fixture.app.get('/api/nodes/%s/_summary' % fixture.cluster_v6_name)

        assert 200 == response.status_code
        res = fixture.get_response_data(response)
        node = res.get('data')[0]
        assert node['host'] == '127.0.0.1'
        assert node['is_data_node'] == True
        assert node['is_master_node'] == True
        # assert fixture.has_all_keys(fixture.config.KEYS_NODE_SUMMARY_FS, node['fs'].keys()) is True
        # assert fixture.has_all_keys(fixture.config.KEYS_NODE_SUMMARY_JVM, node['jvm'].keys()) is True

