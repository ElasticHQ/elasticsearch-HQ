"""
.. module:: query

.. moduleauthor:: Roy Russo <royrusso@gmail.com>
"""

from flask_restful import Resource
from flask import request
from . import api
from ..common.api_response import APIResponse
from ..common.exceptions import request_wrapper, BadRequest
from ..common.status_codes import HTTP_Status
from ..service import QueryService


class Query(Resource):

    @request_wrapper
    def post(self, cluster_name, index_name):
        """

        """
        json_data = request.get_json(force=True)
        params = request.values.to_dict()
        params.update(json_data)

        if json_data.get('query', None) is None:
            raise BadRequest('Missing query in request payload!')

        response = QueryService().run_query(cluster_name, index_name=index_name, query_json=json_data.get('query'))
        return APIResponse(response, HTTP_Status.OK, None)


api.add_resource(Query, '/query/<string:cluster_name>/<string:index_name>',
                 endpoint='query',
                 methods=['POST'])
