"""
.. module:: DiagnosticsService

.. moduleauthor:: Roy Russo <royrusso.gmail.com>
"""

import jmespath

from elastichq.globals import REQUEST_TIMEOUT
from .ConnectionService import ConnectionService
from .NodeService import NodeService


class DiagnosticsService:
    """

    """
    def get_diagnostics_summary(self, cluster_name):
        """
        Returns diagnostics information after running over diag-rules.

        :param cluster_name:
        :return:
        """

        NodeService().get_node_stats(cluster_name)


        connection = ConnectionService().get_connection(cluster_name)
        summary = connection.cluster.health(request_timeout=REQUEST_TIMEOUT)
        summary['version'] = connection.version

        stats = connection.cluster.stats(request_timeout=REQUEST_TIMEOUT)
        summary['indices_size_in_bytes'] = jmespath.search("indices.store.size_in_bytes", stats)
        summary['indices_count'] = jmespath.search("indices.count", stats)
        summary['number_of_documents'] = jmespath.search("indices.docs.count", stats)

        nodes = []
        nodes_info = NodeService().get_node_info(cluster_name)
        the_nodes = nodes_info['nodes']
        nodes_keys = list(the_nodes.keys())
        for key in nodes_keys:
            one_node = the_nodes.get(key)
            node = {}
            node['node_id'] = key
            node['http_address'] = one_node.get('http_address', None)
            node['name'] = one_node.get('name', None)
            node['data'] = jmespath.search("settings.node.data", one_node)
            node['master'] = jmespath.search("settings.node.master", one_node)
            nodes.append(node)
        summary['nodes'] = nodes

        return summary
