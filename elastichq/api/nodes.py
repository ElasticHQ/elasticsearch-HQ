__author__ = 'royrusso'

from flask_restful import Resource

from . import api
from ..common.api_response import APIResponse
from ..common.exceptions import request_wrapper
from ..common.status_codes import HTTP_Status
from ..service import NodeService


class NodesSummary(Resource):
    @request_wrapper
    def get(self, cluster_name, node_ids=None):
        """
        Summary of Node(s). Returns a condensed view of all nodes in the cluster. Summary information is pulled from
        both the info and stats APIs.
        """

        response = NodeService().get_node_summary(cluster_name, node_ids)
        return APIResponse(response, HTTP_Status.OK, None)


class NodesStats(Resource):

    @request_wrapper
    def get(self, cluster_name, node_ids=None):
        """
        Wrapper for https://www.elastic.co/guide/en/elasticsearch/reference/master/cluster-nodes-stats.html
        """

        response = NodeService().get_node_stats(cluster_name, node_ids)
        return APIResponse(response, HTTP_Status.OK, None)


class NodesInfo(Resource):

    @request_wrapper
    def get(self, cluster_name, node_ids=None):
        """
        Wrapper for https://www.elastic.co/guide/en/elasticsearch/reference/master/cluster-nodes-info.html
        """
        response = NodeService().get_node_info(cluster_name, node_ids)
        return APIResponse(response, HTTP_Status.OK, None)


api.add_resource(NodesSummary, '/nodes/<string:cluster_name>/<string:node_ids>/_summary',
                 '/nodes/<string:cluster_name>/_summary', endpoint='nodes_summary', methods=['GET'])
api.add_resource(NodesStats, '/nodes/<string:cluster_name>/<string:node_ids>/_stats',
                 '/nodes/<string:cluster_name>/_stats', endpoint='nodes_stats', methods=['GET'])
api.add_resource(NodesInfo, '/nodes/<string:cluster_name>/<string:node_ids>/_info',
                 '/nodes/<string:cluster_name>/_info', endpoint='nodes_info', methods=['GET'])
