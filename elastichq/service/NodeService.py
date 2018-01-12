__author__ = 'royrusso'

from ..globals import REQUEST_TIMEOUT
from .ConnectionService import ConnectionService


class NodeService:
    def get_node_stats(self, cluster_name, nodes_list=None):
        connection = ConnectionService().get_connection(cluster_name)

        return connection.nodes.stats(node_id=nodes_list, request_timeout=REQUEST_TIMEOUT)

    def get_node_info(self, cluster_name, nodes_list=None):
        connection = ConnectionService().get_connection(cluster_name)

        return connection.nodes.info(node_id=nodes_list, request_timeout=REQUEST_TIMEOUT)
