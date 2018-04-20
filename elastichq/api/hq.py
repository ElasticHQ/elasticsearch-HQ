"""
.. module:: hq

.. moduleauthor:: Roy Russo <royrusso@gmail.com>
"""

from flask import request
from flask_restful import Resource

from . import api
from ..common.api_response import APIResponse
from ..common.exceptions import request_wrapper
from ..common.status_codes import HTTP_Status
from ..service import HQService


class HQClusterSettings(Resource):

    @request_wrapper
    def get(self, cluster_name):
        """
        Gets or Creates the HQ settings for this cluster.
        :param cluster_name:
        :return:
        """
        response = HQService().get_settings(cluster_name)
        return APIResponse(response, HTTP_Status.OK, None)

    @request_wrapper
    def put(self, cluster_name):
        """
        Accepts partial settings doc, ie:
        {
            "websocket_interval": 15,
            "historic_days_to_store" : 10
        }

        :param cluster_name:
        :return:
        """
        json_data = request.get_json(force=True)
        response = HQService().update_settings(cluster_name, json_data)
        return APIResponse(response, HTTP_Status.OK, None)

    @request_wrapper
    def delete(self, cluster_name):
        response = HQService().delete_settings(cluster_name)
        return APIResponse(response, HTTP_Status.OK, None)


api.add_resource(HQClusterSettings, '/hq/<string:cluster_name>/_settings', endpoint='hq_cluster_settings',
                 methods=['GET', 'PUT', 'DELETE'])
