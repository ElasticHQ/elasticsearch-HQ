"""
.. module:: rest

.. moduleauthor:: Roy Russo <royrusso.gmail.com>
"""

from flask_restful import Resource

from elastichq.service import ClusterService, NodeService
from . import api
from ..common.api_response import APIResponse
from ..common.status_codes import HTTP_Status


class GenericREST(Resource):

    def get(self, cluster_name, command):
        """
        :type cluster_name: string
        :param cluster_name
        :type command: string
        :param command:
        :return:
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
            elif command == '_cluster_nodes':
                response = NodeService().get_node_info(cluster_name)
            elif command == '_cluster_nodes_stats':
                response = NodeService().get_node_stats(cluster_name)
            elif command == '_cluster_settings':
                pass
            elif command == '_cluster_settings':
                pass
            elif command == '_cluster_settings':
                pass
            elif command == '_cluster_settings':
                pass
            elif command == '_cluster_settings':
                pass
            elif command == '_cluster_settings':
                pass
            elif command == '_cluster_settings':
                pass
            elif command == '_cluster_settings':
                pass
            elif command == '_cluster_settings':
                pass
            elif command == '_cluster_settings':
                pass
            elif command == '_cluster_settings':
                pass
            elif command == '_cluster_settings':
                pass
            elif command == '_cluster_settings':
                pass
            elif command == '_cluster_settings':
                pass
            elif command == '_cluster_settings':
                pass
            elif command == '_cluster_settings':
                pass

        # summary = DiagnosticsService().get_diagnostics_summary(cluster_name)
        return APIResponse(response, HTTP_Status.OK, None)


api.add_resource(GenericREST, '/rest/<string:cluster_name>/<string:command>',
                 endpoint='generic_rest', methods=['GET'])
