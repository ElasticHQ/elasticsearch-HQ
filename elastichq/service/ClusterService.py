"""
.. module:: ClusterService

.. moduleauthor:: Roy Russo <royrusso.gmail.com>
"""

import jmespath

from elastichq.globals import REQUEST_TIMEOUT
from .ConnectionService import ConnectionService
from .NodeService import NodeService


class ClusterService:
    """
    cc
    """
    def get_cluster_health(self, cluster_name):
        connection = ConnectionService().get_connection(cluster_name)
        return connection.cluster.health(request_timeout=REQUEST_TIMEOUT)

    def get_cluster_state(self, cluster_name, metric=None, indices=None):
        connection = ConnectionService().get_connection(cluster_name)
        return connection.cluster.state(metric=metric, index=indices, request_timeout=REQUEST_TIMEOUT)

    def get_cluster_status(self, cluster_name):
        connection = ConnectionService().get_connection(cluster_name)
        return connection.info(request_timeout=REQUEST_TIMEOUT)

    def get_cluster_stats(self, cluster_name):
        connection = ConnectionService().get_connection(cluster_name)
        return connection.cluster.stats(request_timeout=REQUEST_TIMEOUT)

    def get_cluster_pending_tasks(self, cluster_name):
        connection = ConnectionService().get_connection(cluster_name)
        return connection.cluster.pending_tasks(request_timeout=REQUEST_TIMEOUT)

    def get_cluster_settings(self, cluster_name):
        connection = ConnectionService().get_connection(cluster_name)
        return connection.cluster.get_settings(include_defaults=True, request_timeout=REQUEST_TIMEOUT)

    def put_cluster_settings(self, settings, cluster_name):
        connection = ConnectionService().get_connection(cluster_name)
        return connection.cluster.put_settings(body=settings, request_timeout=REQUEST_TIMEOUT)

    def get_clusters(self, create_if_missing=True):
        clusters = ConnectionService().get_connections()
        for cluster in clusters:
            if cluster.cluster_connected is True:
                cluster.cluster_health = self.get_cluster_health(cluster_name=cluster.cluster_name)
        return clusters

    def get_cluster_summary(self, cluster_name):
        """
        Returns a high-level view of the cluster using several existing endpoints from ES.

        :param cluster_name: 
        :return:
        """
        connection = ConnectionService().get_connection(cluster_name)
        summary = connection.cluster.health(request_timeout=REQUEST_TIMEOUT)
        summary['version'] = connection.version

        stats = connection.cluster.stats(request_timeout=REQUEST_TIMEOUT)
        summary['indices_size_in_bytes'] = jmespath.search("indices.store.size_in_bytes", stats)
        summary['indices_count'] = jmespath.search("indices.count", stats)
        summary['number_of_documents'] = jmespath.search("indices.docs.count", stats)

        nodes = NodeService().get_node_summary(cluster_name)
        summary['nodes'] = nodes

        return summary
