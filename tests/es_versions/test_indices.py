__author__ = 'royrusso'
import logging

import pytest

LOGGER = logging.getLogger(__name__)
pytest_plugins = ["docker_compose"]


@pytest.mark.es_versions
def test_get_index_summary(create_indices, session_scoped_container_getter, fixture):
    """
    Tests index summary endpoint. All ES versions should return the same keys.

    :param fixture:
    :return:
    """
    fixture.add_all_clusters(session_scoped_container_getter)

    response = fixture.app.get('/api/indices/%s/_summary' % fixture.cluster_name)

    assert 200 == response.status_code
    res = fixture.get_response_data(response)
    for index in res['data']:
        if index.get('index_name') == fixture.config.ES_TEST_INDEX_NAME:
            assert index['docs'] == 155
            assert index['docs_deleted'] == 0
            assert index['health'] == 'yellow'
            assert index['index_name'] == 'cars'
            assert index['state'] == 'open'
            assert index['settings']['number_of_shards'] == 5
            assert index['settings']['number_of_replicas'] == 1


@pytest.mark.es_versions
def test_get_aliases(session_scoped_container_getter, fixture):
    """

    :param fixture:
    :return:
    """
    container = session_scoped_container_getter.get('elasticsearch').network_info[0]
    es_cluster_connect = 'http://%s:%s' % (container.hostname, container.host_port)

    fixture.clear_aliases(es_cluster_connect)
    fixture.create_aliases(es_cluster_connect)
    defs = fixture.get_index_definitions()

    for index in defs:
        alias_names = [x['alias'] for x in index['aliases']]

        index_name = index['index']
        response = fixture.app.get('/api/indices/%s/%s/_aliases' % (fixture.cluster_name, index_name))

        assert 200 == response.status_code
        res = fixture.get_response_data(response)
        assert len(res['data']) == 2
        data = res['data']
        for row in data:
            assert row['index_name'] == index_name
            assert row['alias'] in alias_names
