__author__ = 'royrusso'

from .ConnectionService import ConnectionService
from ..globals import REQUEST_TIMEOUT


class NodeService:
    def get_node_stats(self, cluster_name, nodes_list=None, request_timeout=REQUEST_TIMEOUT):
        connection = ConnectionService().get_connection(cluster_name)

        node_stats = connection.nodes.stats(node_id=nodes_list, request_timeout=request_timeout)

        return node_stats

    def get_node_info(self, cluster_name, nodes_list=None):
        connection = ConnectionService().get_connection(cluster_name)

        node_infos = connection.nodes.info(node_id=nodes_list, metric="_all", request_timeout=REQUEST_TIMEOUT)

        # breaking change == miserable hack. v7 is missing the settings block that used to contain master/data designations
        if connection.version.startswith("7"):
            for node_id in node_infos['nodes']:
                node_settings = node_infos.get("nodes").get(node_id)['settings']
                node_roles = node_infos.get("nodes").get(node_id)['roles']
                if 'master' in node_roles:
                    node_settings['node']['master'] = True
                if 'data' in node_roles:
                    node_settings['node']['data'] = True

        return node_infos

    def get_node_cat(self, cluster_name, flags="*", request_timeout=REQUEST_TIMEOUT):
        connection = ConnectionService().get_connection(cluster_name)
        # "id,m,n,u,role,hp,ip,disk.avail,l"
        cat_nodes = connection.cat.nodes(format="json", h=flags, full_id=True, request_timeout=request_timeout)
        return cat_nodes

    def get_node_summary(self, cluster_name):
        """
        Given a node(s), consolidates data from several Node APIs in a human-readable format.
        :param cluster_name:
        :param node_ids:
        :return: List of nodesummary
        """
        connection = ConnectionService().get_connection(cluster_name)

        # https://www.elastic.co/guide/en/elasticsearch/reference/current/cat-nodes.html
        cat_nodes = connection.cat.nodes(format="json", h="id,m,n,u,role,hc,hm,hp,ip,dt,du,disk.avail,l", full_id=True,
                                         request_timeout=REQUEST_TIMEOUT)

        nodes = []
        for cnode in cat_nodes:

            node = {"node_id": cnode.get('id', None),
                    "name": cnode.get('n', None),
                    "fsFree": cnode.get('disk.avail', None),
                    "heapPercent": cnode.get('hp', None),
                    "heapMax": cnode.get('hm', None),
                    "heapCurrent": cnode.get('hc', None),
                    "host": cnode.get('ip', None),
                    "load": cnode.get('l', None)
                    }

            node.update({"uptime": cnode.get('u')})
            if cnode.get('m', None) is not None:
                if cnode['m'] == '*':
                    node.update({"is_master_node": True})
                    node.update({
                        "is_electable_master": False})  # technically this node is electable, but since it has already been elected, we set as false for the ui.
                elif cnode['m'] == '-':
                    node.update({"is_master_node": False})
                    node.update({"is_electable_master": False})
                elif cnode['m'] == 'm':
                    node.update({"is_master_node": False})
                    node.update({"is_electable_master": True})
                else:
                    node.update({"is_master_node": False})
                    node.update({"is_electable_master": False})

            if cnode.get('role', None) is not None:
                if cnode['role'] == 'd' or 'd' in cnode['role']:
                    node.update({"is_data_node": True})
                else:
                    node.update({"is_data_node": False})
                if cnode['role'] == 'i' or 'i' in cnode['role']:
                    node.update({"is_ingest_node": True})
                else:
                    node.update({"is_ingest_node": False})

            nodes.append(node)
        return nodes
