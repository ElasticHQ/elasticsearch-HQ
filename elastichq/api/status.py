__author__ = 'royrusso'

import json
from urllib.parse import unquote_plus
from urllib import request

from flask_restful import Resource

from flask import current_app, url_for

from elastichq.model.ClusterModel import ClusterDTO
from ..service import ClusterService
from ..common.status_codes import HTTP_Status
from . import api
from ..common.api_response import APIResponse
from ..globals import LOG


class Status(Resource):
    def get(self):

        version_str = ""
        try:
            fp = request.urlopen("http://www.elastichq.org/currversion.json", timeout=10)
            mbyte = fp.read()
            version_str = mbyte.decode("utf-8")
            fp.close()
        except Exception as ex:
            LOG.error("error retrieving version information", ex)

        stable_version = (json.loads(version_str)).get("version", None)

        clusters = ClusterService().get_clusters()
        schema = ClusterDTO(many=True)
        result = schema.dump(clusters)

        status = {
            "name": "ElasticHQ",
            "installed_version": current_app.config.get('API_VERSION'),
            "current_stable_version": stable_version,
            "tagline": "You know, for Elasticsearch",
            "clusters": result.data
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
            line = {"api": rule.endpoint, "methods": methods, "url": unquote_plus(url)}
            output.append(line)

        output = sorted(output, key=lambda _: _.get('url'))
        return APIResponse(output, HTTP_Status.OK, None)


api.add_resource(Routes, '/routes', endpoint='routes', methods=['GET'])
api.add_resource(Status, '/status', endpoint='status', methods=['GET'])
