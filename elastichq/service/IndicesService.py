__author__ = 'royrusso'

import jmespath

from elastichq.service import ClusterService, ConnectionService
from ..globals import REQUEST_TIMEOUT


class IndicesService:
    def get_indices_stats(self, cluster_name, indices_names=None):
        connection = ConnectionService().get_connection(cluster_name)
        return connection.indices.stats(index=indices_names, request_timeout=REQUEST_TIMEOUT)

    def get_indices(self, cluster_name, index_name=None):
        connection = ConnectionService().get_connection(cluster_name)
        return connection.indices.get(index=index_name or "_all", request_timeout=REQUEST_TIMEOUT)

    def delete_indices(self, cluster_name, index_name):
        connection = ConnectionService().get_connection(cluster_name)
        return connection.indices.delete(index=index_name, request_timeout=REQUEST_TIMEOUT)

    def create_index(self, cluster_name, index_name, settings=None):
        connection = ConnectionService().get_connection(cluster_name)
        return connection.indices.create(index=index_name, body=settings, request_timeout=REQUEST_TIMEOUT)

    def open_index(self, cluster_name, index_name):
        connection = ConnectionService().get_connection(cluster_name)
        return connection.indices.open(index=index_name, request_timeout=REQUEST_TIMEOUT)

    def close_index(self, cluster_name, index_name):
        connection = ConnectionService().get_connection(cluster_name)
        return connection.indices.close(index=index_name, request_timeout=REQUEST_TIMEOUT)

    def flush_index(self, cluster_name, index_name):
        connection = ConnectionService().get_connection(cluster_name)
        return connection.indices.flush(index=index_name, request_timeout=REQUEST_TIMEOUT)

    def refresh_index(self, cluster_name, index_name):
        connection = ConnectionService().get_connection(cluster_name)
        return connection.indices.refresh(index=index_name, request_timeout=REQUEST_TIMEOUT)

    def clear_cache(self, cluster_name, index_name):
        connection = ConnectionService().get_connection(cluster_name)
        return connection.indices.clear_cache(index=index_name, request_timeout=REQUEST_TIMEOUT)

    def get_alias(self, cluster_name, index_name):
        """
        Fetches alias definitions for an index, if passed in. For now, we ignore nested data inside of the alias payload, like filter terms. 
        TODO: https://www.elastic.co/guide/en/elasticsearch/reference/2.0/indices-aliases.html#_examples_2
        :param cluster_name: 
        :param index_name: 
        :return:
        """

        connection = ConnectionService().get_connection(cluster_name)
        alias_defs = connection.indices.get_alias(index=index_name, request_timeout=REQUEST_TIMEOUT)
        aliases = []
        for index_name in alias_defs:
            aliases_as_dicts = alias_defs[index_name].get('aliases', None)
            alias_keys = list(aliases_as_dicts)
            if alias_keys:
                for key in alias_keys:
                    row = {'index_name': index_name, 'alias': key}
                    aliases.append(row)
        return aliases

    def remove_alias(self, cluster_name, index_name, alias_name):
        connection = ConnectionService().get_connection(cluster_name)
        return connection.indices.delete_alias(index_name, name=alias_name)

    def create_alias(self, cluster_name, index_name, alias_name):
        connection = ConnectionService().get_connection(cluster_name)
        return connection.indices.put_alias(index_name, name=alias_name)

    def force_merge(self, cluster_name, index_name):
        connection = ConnectionService().get_connection(cluster_name)
        return connection.indices.forcemerge(index=index_name, request_timeout=REQUEST_TIMEOUT)

    def get_mapping(self, cluster_name, index_name, mapping_name):
        # TODO: add options here, per: https://www.elastic.co/guide/en/elasticsearch/reference/6.x/indices-get-mapping.html#indices-get-mapping
        connection = ConnectionService().get_connection(cluster_name)
        return connection.indices.get_mapping(index=index_name, doc_type=mapping_name, request_timeout=REQUEST_TIMEOUT)

    def get_indices_summary(self, cluster_name, indices_names=None):
        """
        Returns a formatted representation of one/many indices.
        :param cluster_name:
        :param indices_names:
        :return:
        """
        connection = ConnectionService().get_connection(cluster_name)
        indices_stats = connection.indices.stats(index=indices_names, request_timeout=REQUEST_TIMEOUT)

        # get shard info
        cluster_state = ClusterService().get_cluster_state(cluster_name, metric="metadata", indices=indices_names)
        state_indices = jmespath.search("metadata.indices", cluster_state)
        cat = connection.cat.indices(format='json')
        indices = []
        if state_indices:
            the_indices = indices_stats.get("indices", None)
            index_keys = list(the_indices.keys())
            for key in index_keys:
                one_index = the_indices.get(key)
                index = {"index_name": key}
                index['health'] = [x['health'] for x in cat if x['index'] == key][0]
                index['docs'] = jmespath.search("primaries.docs.count", one_index)
                index['docs_deleted'] = jmespath.search("primaries.docs.deleted", one_index)
                index['size_in_bytes'] = jmespath.search("primaries.store.size_in_bytes", one_index)
                index['fielddata'] = {
                    'memory_size_in_bytes': jmespath.search("total.fielddata.memory_size_in_bytes", one_index)}

                index_state = state_indices.get(key)
                index['settings'] = {
                    'number_of_shards': int(jmespath.search("settings.index.number_of_shards", index_state)),
                    "number_of_replicas": int(jmespath.search("settings.index.number_of_replicas", index_state))}
                index['state'] = index_state.get("state", None)
                indices.append(index)
        return indices

    def get_shards(self, cluster_name, index_name):
        connection = ConnectionService().get_connection(cluster_name)
        shards = connection.cat.shards(index=index_name, format='json')
        return shards

    def expunge_deleted(self, cluster_name, index_name):
        connection = ConnectionService().get_connection(cluster_name)
        try:
            return connection.indices.forcemerge(index=index_name, params={"only_expunge_deletes": 1},
                                                 request_timeout=REQUEST_TIMEOUT)
        except: # this will time out on large indices, so ignore.
            return

    def get_indices_templates(self, cluster_name):
        connection = ConnectionService().get_connection(cluster_name)
        return connection.indices.get_template()

    def get_indices_segments(self, cluster_name):
        connection = ConnectionService().get_connection(cluster_name)
        return connection.indices.segments()

    def get_indices_shard_stores(self, cluster_name):
        connection = ConnectionService().get_connection(cluster_name)
        return connection.indices.shard_stores()

    def get_indices_recovery(self, cluster_name):
        connection = ConnectionService().get_connection(cluster_name)
        return connection.indices.recovery()




