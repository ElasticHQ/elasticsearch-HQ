__author__ = 'royrusso'

import jmespath

from ..globals import REQUEST_TIMEOUT
from elastichq.service import ConnectionService


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
        return connection.indices.create(index=index_name, request_timeout=REQUEST_TIMEOUT)

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
        # TODO
        pass

    def remove_alias(self, cluster_name, index_name, alias_name):
        # TODO
        pass

    def create_alias(self, cluster_name, index_name, alias_name):
        # TODO
        pass

    def force_merge(self, cluster_name, index_name):
        connection = ConnectionService().get_connection(cluster_name)
        return connection.indices.forcemerge(index=index_name, request_timeout=REQUEST_TIMEOUT)

    def get_mapping(self, cluster_name, index_name, mapping_name):
        # TODO: add options here, per: https://www.elastic.co/guide/en/elasticsearch/reference/6.x/indices-get-mapping.html#indices-get-mapping
        connection = ConnectionService().get_connection(cluster_name)
        return connection.indices.get_mapping(index=index_name, doc_type=mapping_name, request_timeout=REQUEST_TIMEOUT)

    def get_indices_summary(self, cluster_name, indices_names=None):
        connection = ConnectionService().get_connection(cluster_name)
        indices_stats = connection.indices.stats(index=indices_names, request_timeout=REQUEST_TIMEOUT)
        indices = []
        the_indices = indices_stats.get("indices", None)
        index_keys = list(the_indices.keys())
        for key in index_keys:
            one_index = the_indices.get(key)
            index = {"index_name": key}
            index['docs'] = jmespath.search("primaries.docs.count", one_index)
            index['size_in_bytes'] = jmespath.search("primaries.store.size_in_bytes", one_index)
            index['fielddata'] = {'memory_size_in_bytes': jmespath.search("total.fielddata.memory_size_in_bytes", one_index)}
            indices.append(index)
        return indices
