__author__ = 'royrusso'

import jmespath


class TestNodes_v2:
    def test_get_node_stats(self, fixture):

        response = fixture.app.get('/api/nodes/%s/_stats' % fixture.cluster_v2_name)

        assert 200 == response.status_code
        res = fixture.get_response_data(response)

        assert fixture.has_all_keys(fixture.config.KEYS_NODE_STATS, jmespath.search('*', res['data'][0]['nodes'])[0]) is True

    def test_get_one_node_stats(self, fixture):

        response = fixture.app.get('/api/nodes/%s/_stats' % fixture.cluster_v2_name)

        assert 200 == response.status_code
        res = fixture.get_response_data(response)

        # get node ID:
        node_id = list(jmespath.search('nodes', res['data'][0]).keys())[0]
        response = fixture.app.get('/api/nodes/%s/%s/_stats' % (fixture.cluster_v2_name, node_id))
        res = fixture.get_response_data(response)
        assert list(jmespath.search('nodes', res['data'][0]).keys())[0] == node_id
        
        assert fixture.has_all_keys(fixture.config.KEYS_NODE_STATS, res['data'][0]['nodes'][node_id].keys()) is True

    def test_get_node_info(self, fixture):

        response = fixture.app.get('/api/nodes/%s/_info' % fixture.cluster_v2_name)

        assert 200 == response.status_code
        res = fixture.get_response_data(response)
        assert fixture.has_all_keys(fixture.config.KEYS_NODE_INFO, jmespath.search('*', res['data'][0]['nodes'])[0]) is True

    def test_get_one_node_info(self, fixture):

        response = fixture.app.get('/api/nodes/%s/_info' % fixture.cluster_v2_name)

        assert 200 == response.status_code
        res = fixture.get_response_data(response)
        
        node_id = list(jmespath.search('nodes', res['data'][0]).keys())[0]
        response = fixture.app.get('/api/nodes/%s/%s/_info' % (fixture.cluster_v2_name, node_id))
        res = fixture.get_response_data(response)
        assert list(jmespath.search('nodes', res['data'][0]).keys())[0] == node_id
        assert fixture.has_all_keys(fixture.config.KEYS_NODE_INFO, res['data'][0]['nodes'][node_id]) is True
