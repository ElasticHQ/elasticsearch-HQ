__author__ = 'royrusso'

from flask_restful import Resource

from ..common.status_codes import HTTP_Status
from . import api
from ..common.api_response import APIResponse
from ..service import IndicesService
from ..common.exceptions import request_wrapper


class IndexStats(Resource):
    @request_wrapper
    def get(self, cluster_name, index_names=None):
        response = IndicesService().get_indices_stats(cluster_name, index_names)
        return APIResponse(response, HTTP_Status.OK, None)


class IndexList(Resource):
    @request_wrapper
    def get(self, cluster_name, index_name=None):
        response = IndicesService().get_indices(cluster_name, index_name)
        return APIResponse(response, HTTP_Status.OK, None)

api.add_resource(IndexStats, '/indices/<string:cluster_name>/<string:index_names>/_stats', '/indices/<string:cluster_name>/_stats', endpoint='indices_stats', methods=['GET'])
api.add_resource(IndexList, '/indices/<string:cluster_name>/<string:index_name>', '/indices/<string:cluster_name>', endpoint='indices', methods=['GET'])
