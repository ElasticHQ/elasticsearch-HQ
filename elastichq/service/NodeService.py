__author__ = 'royrusso'

import jmespath

from ..globals import REQUEST_TIMEOUT
from .ConnectionService import ConnectionService


class NodeService:
    def get_node_stats(self, cluster_name, nodes_list=None):
        connection = ConnectionService().get_connection(cluster_name)

        return connection.nodes.stats(node_id=nodes_list, request_timeout=REQUEST_TIMEOUT)

    def get_node_info(self, cluster_name, nodes_list=None):
        connection = ConnectionService().get_connection(cluster_name)

        return connection.nodes.info(node_id=nodes_list, request_timeout=REQUEST_TIMEOUT)

    def get_node_summary(self, cluster_name, node_ids=None):
        connection = ConnectionService().get_connection(cluster_name)
        nodes_stats = connection.nodes.stats(node_id=node_ids, metric="fs,jvm,os,process", request_timeout=REQUEST_TIMEOUT)
        node_ids = list(nodes_stats['nodes'].keys())

        nodes = []
        for node_id in node_ids:
            node_dict = nodes_stats['nodes'][node_id]
            node = {"node_id": node_id,
                    "name": jmespath.search("name", node_dict),
                    "jvm": jmespath.search("jvm.mem", node_dict),
                    "fs": jmespath.search("fs.data[0]", node_dict),
                    "host": jmespath.search("host", node_dict)
                    }
            if connection.version.startswith("2"):
                node.update({"is_master_node": jmespath.search("attributes.master", node_dict)})

                node_info = self.get_node_info(cluster_name, node_id)
                if node_info:
                    node_settings = jmespath.search("nodes.*.settings", node_info)[0].get("node", None)
                    if node_settings is not None:
                        node.update({"is_data_node": node_settings.get("data", False)})

            else:
                node_roles = jmespath.search("roles", node_dict)
                if "master" in node_roles:
                    node.update({"is_master_node": True})
                else:
                    node.update({"is_master_node": False})

                if "data" in node_roles:
                    node.update({"is_data_node": True})
                else:
                    node.update({"is_data_node": False})

            nodes.append(node)
        return nodes
