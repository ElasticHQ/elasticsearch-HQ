"""
.. module:: diagnostics

.. moduleauthor:: Roy Russo <royrusso.gmail.com>
"""

from flask_restful import Resource

from elastichq.service import DiagnosticsService
from . import api
from ..common.api_response import APIResponse
from ..common.status_codes import HTTP_Status


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


api.add_resource(DiagnosticsSummary, '/clusters/<string:cluster_name>/diagnostics/_summary',
                 endpoint='diagnostics_summary', methods=['GET'])
