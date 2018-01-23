__author__ = 'royrusso'

from flask_restful import Resource

from . import api
from ..common.api_response import APIResponse
from ..common.exceptions import request_wrapper
from ..common.status_codes import HTTP_Status
from ..service import NodeService


class NodesSummary(Resource):
    """
    Summary of Node(s).
    """

    @request_wrapper
    def get(self, cluster_name, node_ids=None):
        response = NodeService().get_node_summary(cluster_name, node_ids)
        return APIResponse(response, HTTP_Status.OK, None)


class NodesStats(Resource):
    """
    Wrapper for https://www.elastic.co/guide/en/elasticsearch/reference/master/cluster-nodes-stats.html
    """

    @request_wrapper
    def get(self, cluster_name, node_ids=None):
        response = NodeService().get_node_stats(cluster_name, node_ids)
        return APIResponse(response, HTTP_Status.OK, None)


class NodesInfo(Resource):
    """
    Wrapper for https://www.elastic.co/guide/en/elasticsearch/reference/master/cluster-nodes-info.html
    """

    @request_wrapper
    def get(self, cluster_name, node_ids=None):
        response = NodeService().get_node_info(cluster_name, node_ids)
        return APIResponse(response, HTTP_Status.OK, None)


api.add_resource(NodesSummary, '/nodes/<string:cluster_name>/<string:node_ids>/_summary',
                 '/nodes/<string:cluster_name>/_summary', endpoint='nodes_summary', methods=['GET'])
api.add_resource(NodesStats, '/nodes/<string:cluster_name>/<string:node_ids>/_stats',
                 '/nodes/<string:cluster_name>/_stats', endpoint='nodes_stats', methods=['GET'])
api.add_resource(NodesInfo, '/nodes/<string:cluster_name>/<string:node_ids>/_info',
                 '/nodes/<string:cluster_name>/_info', endpoint='nodes_info', methods=['GET'])
