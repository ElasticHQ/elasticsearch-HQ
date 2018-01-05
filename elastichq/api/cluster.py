__author__ = 'royrusso'

from flask_restful import Resource
from flask import request

from ..common.status_codes import HTTP_Status
from . import api
from ..common.api_response import APIResponse
from ..service import ClusterService
from ..common.exceptions import request_wrapper, BadRequest


class ClusterHealth(Resource):
    @request_wrapper
    def get(self, cluster_name):

        response = ClusterService().get_cluster_health(cluster_name)
        return APIResponse(response, HTTP_Status.OK, None)


api.add_resource(ClusterHealth, '/cluster/health/<string:cluster_name>', endpoint='cluster_health', methods=['GET'])
