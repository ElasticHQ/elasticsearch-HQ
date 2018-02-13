"""
.. module:: rest

.. moduleauthor:: Roy Russo <royrusso.gmail.com>
"""

from flask_restful import Resource

from elastichq.model.ClusterModel import ClusterDTO
from elastichq.service import ClusterService, ConnectionService, HQService, IndicesService, NodeService
from . import api
from ..common.api_response import APIResponse
from ..common.status_codes import HTTP_Status


class GenericREST(Resource):

    def get(self, cluster_name, command):
        """
        Endpoint for generic GET requests on a cluster. Simply does a pass-thru call to the actual cluster endpoint.

        :type cluster_name: string
        :param cluster_name:
        :type command: string
        :param command:
        :returns:

        :resheader Content-Type: application/json
        :status 200: OK
        :status 500: server error
        """

        if command is not None:
            if command == '_cluster_status':
                response = ClusterService().get_cluster_status(cluster_name)
            elif command == '_cluster_settings':
                response = ClusterService().get_cluster_settings(cluster_name)
            elif command == '_cluster_state':
                response = ClusterService().get_cluster_state(cluster_name)
            elif command == '_cluster_stats':
                response = ClusterService().get_cluster_stats(cluster_name)
            elif command == '_cluster_health':
                response = ClusterService().get_cluster_health(cluster_name)
            elif command == '_nodes':
                response = NodeService().get_node_info(cluster_name)
            elif command == '_nodes_stats':
                response = NodeService().get_node_stats(cluster_name)
            elif command == '_indices_info':
                response = IndicesService().get_indices(cluster_name)
            elif command == '_indices_mappings':
                response = IndicesService().get_mapping(cluster_name)
            elif command == '_indices_aliases':
                response = IndicesService().get_alias(cluster_name)
            elif command == '_indices_stats':
                response = IndicesService().get_indices_stats(cluster_name)
            elif command == '_indices_templates':
                response = IndicesService().get_indices_templates(cluster_name)
            elif command == '_indices_segments':
                response = IndicesService().get_indices_segments(cluster_name)
            elif command == '_indices_shard_stores':
                response = IndicesService().get_indices_shard_stores(cluster_name)
            elif command == '_indices_recovery':
                response = IndicesService().get_indices_recovery(cluster_name)
            elif command == '_hq_status':
                response = HQService().get_status()
            elif command == '_hq_cluster_summary':
                response = ClusterService().get_cluster_summary(cluster_name)
            elif command == '_hq_cluster_list':
                res = ClusterService().get_clusters()
                schema = ClusterDTO(many=True)
                response = schema.dump(res)
            elif command.startswith('_cat'):  # cat api is pretty safe and does not currently have a Service interface
                connection = ConnectionService().get_connection(cluster_name)
                format = 'json'
                if command == '_cat_aliases':
                    response = connection.cat.aliases(format=format, h="*")
                elif command == '_cat_allocation':
                    response = connection.cat.allocation(format=format, h="*")
                elif command == '_cat_count':
                    response = connection.cat.count(format=format, h="*")
                elif command == '_cat_fielddata':
                    response = connection.cat.fielddata(format=format, h="*")
                elif command == '_cat_health':
                    response = connection.cat.health(format=format, h="*")
                elif command == '_cat_indices':
                    response = connection.cat.indices(format=format, h="*")
                elif command == '_cat_master':
                    response = connection.cat.master(format=format, h="*")
                elif command == '_cat_nodeattrs':
                    response = connection.cat.nodeattrs(format=format, h="*")
                elif command == '_cat_nodes':
                    response = connection.cat.nodes(format=format, full_id=True, h="*")
                elif command == '_cat_pending_tasks':
                    response = connection.cat.pending_tasks(format=format, h="*")
                elif command == '_cat_plugins':
                    response = connection.cat.plugins(format=format, h="*")
                elif command == '_cat_recovery':
                    response = connection.cat.recovery(format=format, h="*")
                elif command == '_cat_thread_pool':
                    response = connection.cat.thread_pool(format=format, h="*")
                elif command == '_cat_shards':
                    response = connection.cat.shards(format=format, h="*")
                elif command == '_cat_segments':
                    response = connection.cat.segments(format=format, h="*")

        # summary = DiagnosticsService().get_diagnostics_summary(cluster_name)
        return APIResponse(response, HTTP_Status.OK, None)


api.add_resource(GenericREST, '/rest/<string:cluster_name>/<string:command>',
                 endpoint='generic_rest', methods=['GET'])
