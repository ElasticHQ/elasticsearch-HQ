"""
.. module:: status

.. moduleauthor:: Roy Russo <royrusso.gmail.com>
"""
import json
from urllib import request
from urllib.parse import unquote_plus

from flask import current_app, url_for
from flask_restful import Resource

from elastichq.model.ClusterModel import ClusterDTO
from . import api
from ..common.api_response import APIResponse
from ..common.status_codes import HTTP_Status
from ..globals import LOG
from ..service import ClusterService


class Status(Resource):
    """
    Returns status information about HQ and all connected clusters.

    **Example response**:

    .. sourcecode:: http

      HTTP/1.1 200 OK
      Vary: Accept
      Content-Type: application/json

    .. code-block:: json

        {
            "status_code": 200,
            "response_time": 1648,
            "message": null,
            "data": [
                {
                    "name": "",
                    "installed_version": "",
                    "current_stable_version": "9200",
                    "clusters": []
                }
            ]
        }

    **Response Structure**

      - *(dict) --*

        - **name** *(string) --*
        - **installed_version** *(string) --*
        - **current_stable_version** *(string) --* Taken from pinging github for the current master release version
        - **clusters** *(list) --*

    :resheader Content-Type: application/json
    :status 200: OK
    :status 500: server error
    """

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
    From: http://flask.pocoo.org/snippets/117/

    Returns a list of available routes in the API.

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
