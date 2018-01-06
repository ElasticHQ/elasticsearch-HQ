__author__ = 'royrusso'

from ..globals import CONNECTIONS, REQUEST_TIMEOUT


class IndicesService:
    def get_indices_stats(self, cluster_name, indices_names=None):
        connection = CONNECTIONS.get_connection(cluster_name)
        return connection.indices.stats(index=indices_names, request_timeout=REQUEST_TIMEOUT)

    def get_indices(self, cluster_name, index_name=None):
        connection = CONNECTIONS.get_connection(cluster_name)
        return connection.indices.get(index=index_name or "_all", request_timeout=REQUEST_TIMEOUT)

    def delete_indices(self, cluster_name, index_name):
        connection = CONNECTIONS.get_connection(cluster_name)
        return connection.indices.delete(index=index_name, request_timeout=REQUEST_TIMEOUT)

    def create_index(self, cluster_name, index_name, settings=None):
        connection = CONNECTIONS.get_connection(cluster_name)
        return connection.indices.create(index=index_name, request_timeout=REQUEST_TIMEOUT)

    def open_index(self, cluster_name, index_name):
        connection = CONNECTIONS.get_connection(cluster_name)
        return connection.indices.open(index=index_name, request_timeout=REQUEST_TIMEOUT)

    def close_index(self, cluster_name, index_name):
        connection = CONNECTIONS.get_connection(cluster_name)
        return connection.indices.close(index=index_name, request_timeout=REQUEST_TIMEOUT)

    def flush_index(self, cluster_name, index_name):
        connection = CONNECTIONS.get_connection(cluster_name)
        return connection.indices.flush(index=index_name, request_timeout=REQUEST_TIMEOUT)

    def refresh_index(self, cluster_name, index_name):
        connection = CONNECTIONS.get_connection(cluster_name)
        return connection.indices.refresh(index=index_name, request_timeout=REQUEST_TIMEOUT)

    def clear_cache(self, cluster_name, index_name):
        connection = CONNECTIONS.get_connection(cluster_name)
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
        connection = CONNECTIONS.get_connection(cluster_name)
        return connection.indices.forcemerge(index=index_name, request_timeout=REQUEST_TIMEOUT)

    def get_mapping(self, cluster_name, index_name, mapping_name):
        # TODO: add options here, per: https://www.elastic.co/guide/en/elasticsearch/reference/6.x/indices-get-mapping.html#indices-get-mapping
        connection = CONNECTIONS.get_connection(cluster_name)
        return connection.indices.get_mapping(index=index_name, doc_type=mapping_name, request_timeout=REQUEST_TIMEOUT)
