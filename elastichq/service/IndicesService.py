__author__ = 'royrusso'

from ..globals import CONNECTIONS, REQUEST_TIMEOUT


class IndicesService:
    def get_indices_stats(self, cluster_name, indices_names=None):
        connection = CONNECTIONS.get_connection(cluster_name)

        return connection.indices.stats(index=indices_names, request_timeout=REQUEST_TIMEOUT)

    def get_indices(self, cluster_name, index_name=None):
        connection = CONNECTIONS.get_connection(cluster_name)

        return connection.indices.get(index=index_name or "_all", request_timeout=REQUEST_TIMEOUT)
