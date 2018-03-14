"""
.. module:: indices

.. moduleauthor:: Roy Russo <royrusso@gmail.com>
"""

from flask_restful import Resource

from . import api
from ..common.api_response import APIResponse
from ..common.exceptions import request_wrapper
from ..common.status_codes import HTTP_Status
from ..service import SnapshotService


class Repositories(Resource):
    @request_wrapper
    def get(self, cluster_name):
        """
        :param cluster_name:
        :return:
        """
        response = SnapshotService().get_repositories(cluster_name)
        return APIResponse(response, HTTP_Status.OK, None)


api.add_resource(Repositories, '/repositories/<string:cluster_name>',
                 endpoint='snapshot_repositories',
                 methods=['GET'])
