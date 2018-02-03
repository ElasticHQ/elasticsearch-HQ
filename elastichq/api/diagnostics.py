"""
.. module:: diagnostics

.. moduleauthor:: Roy Russo <royrusso.gmail.com>
"""

import json
from urllib.parse import unquote_plus
from flask import request
import json
from flask_restful import Resource

from flask import current_app, url_for

from elastichq.model.ClusterModel import ClusterDTO
from ..service import ClusterService
from ..common.status_codes import HTTP_Status
from . import api
from ..common.api_response import APIResponse
from ..globals import LOG
from elastichq.service import DiagnosticsService

class DiagnosticsSummary(Resource):

    def get(self, cluster_name):
        """
        Executes diagnostics rules across the cluster, and returns

        :type cluster_name: string
        :param cluster_name:
        :return:
        """

        summary = DiagnosticsService().get_diagnostics_summary(cluster_name)
        return APIResponse(summary, HTTP_Status.CREATED, None)
#
# class Diagnostics(Resource):
#
#     def get(self, cluster_name, node_id):
#         """
#         Executes diagnostics rules for one node, and returns values and threshold information.
#
#         :type cluster_name: string
#         :param cluster_name:
#         :type node_id: string
#         :param node_id: ID of node to fetch diagnostics information for.
#         :return:
#         """
#
#
#
#
#         result = []
#         return APIResponse(result.data, HTTP_Status.CREATED, None)


api.add_resource(DiagnosticsSummary, '/diagnostics/<string:cluster_name>/_summary', endpoint='diagnostics_summary', methods=['GET'])
#api.add_resource(Diagnostics, '/diagnostics/<string:cluster_name>/<string:node_id>/_stats', endpoint='diagnostics_stats', methods=['GET'])
