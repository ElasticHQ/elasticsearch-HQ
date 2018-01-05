__author__ = 'royrusso'

import json

from flask_restful import Resource

from ..common.status_codes import HTTP_Status
from . import api
from ..common.api_response import APIResponse
from ..constants import LOG


class Status(Resource):
    def get(self):
        status = {
            "name": "ElasticHQ",
            "version": "3.0",
            "tagline": "You know, for Elasticsearch"
        }
        LOG.debug(json.dumps(status))
        return APIResponse(status, HTTP_Status.OK, None)


api.add_resource(Status, '/status', endpoint='status')
