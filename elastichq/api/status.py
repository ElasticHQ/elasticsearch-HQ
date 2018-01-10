__author__ = 'royrusso'

import json
from urllib.parse import unquote_plus, unquote

from flask_restful import Resource

from flask import current_app, url_for

from ..common.status_codes import HTTP_Status
from . import api
from ..common.api_response import APIResponse
from ..globals import LOG


class Status(Resource):
    def get(self):
        status = {
            "name": "ElasticHQ",
            "version": "3.0",
            "tagline": "You know, for Elasticsearch"
        }
        LOG.debug(json.dumps(status))
        return APIResponse(status, HTTP_Status.OK, None)


class Routes(Resource):
    """
    http://flask.pocoo.org/snippets/117/
    """

    def get(self):
        output = []
        for rule in current_app.url_map.iter_rules():

            options = {}
            for arg in rule.arguments:
                options[arg] = "[{0}]".format(arg)

            methods = ','.join(rule.methods)
            url = url_for(rule.endpoint, **options)
            line = unquote("{:50s} {:20s} {}".format(rule.endpoint, methods, url))
            output.append(line)

        for line in sorted(output):
            output = []
            for rule in current_app.url_map.iter_rules():

                options = {}
                for arg in rule.arguments:
                    options[arg] = "[{0}]".format(arg)

                methods = ','.join(rule.methods)
                url = url_for(rule.endpoint, **options)
                line = {"api": rule.endpoint, "methods": methods, "url": unquote_plus(url)}
                output.append(line)

            output = sorted(output, key=lambda _: _.get('url'))

            return APIResponse(output, HTTP_Status.OK, None)


api.add_resource(Routes, '/routes', endpoint='routes', methods=['GET'])
api.add_resource(Status, '/status', endpoint='status', methods=['GET'])
