__author__ = 'royrusso'

from flask_restful import Resource
from flask import request

from ..common.status_codes import HTTP_Status
from . import api
from ..common.api_response import APIResponse
from ..service import ClusterService
from ..common.exceptions import request_wrapper, BadRequest


class HQ(Resource):
    @request_wrapper
    def post(self):
        """
        Creates a connection to a given host/port. Accepts a JSON POST BODY
        :arg: ip: Host IP
        :arg: port: Port. Defaults to 9200
        :arg: is_https: optional argument indicates scheme
        :return:
        """
        json_data = request.get_json(force=True)
        params = request.values.to_dict()
        params.update(json_data)

        if params.get('ip', None) is None:
            raise BadRequest(message='Missing required parameters.')

        scheme = 'http'
        if params.get('is_https', None) is True:
            scheme = 'https'

        response = ClusterService().create_connection(ip=params['ip'], port=params.get('port', "9200"), scheme=scheme)
        return APIResponse(response, HTTP_Status.OK, None)


api.add_resource(HQ, '/hq/connect', endpoint='hq_connect', methods=['POST'])
