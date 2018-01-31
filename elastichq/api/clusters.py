"""
.. module:: clusters

.. moduleauthor:: Roy Russo <royrusso.gmail.com>
"""

from flask import request
from flask_restful import Resource

from elastichq.model import ClusterDTO
from . import api
from ..common.api_response import APIResponse
from ..common.exceptions import BadRequest, request_wrapper
from ..common.status_codes import HTTP_Status
from ..service import ClusterService, ConnectionService


class ClusterConnection(Resource):
    """
    Manages cluster connection pool.
    """

    @request_wrapper
    def post(self):
        """
        Creates a connection to a given host/port. Accepts a JSON POST BODY. This will add the connection, if it doesn't already
        exist, to the pool of connections and save the details in the database.

        .. :quickref: Creates a connection to the cluster.

        **Example request**:

        .. sourcecode:: http

          GET /clusters/_connect/ HTTP/1.1
          Accept: application/json

        **Example response**:

        .. sourcecode:: http

          HTTP/1.1 200 OK
          Content-Type: application/json

          [
            {
              "post_id": 12345,
              "author": "/author/123/",
              "tags": ["sphinx", "rst", "flask"],
              "title": "Documenting API in Sphinx with httpdomain",
              "body": "How to..."
            },
            {
              "post_id": 12346,
              "author": "/author/123/",
              "tags": ["python3", "typehints", "annotations"],
              "title": "To typehint or not to typehint that is the question",
              "body": "Static checking in python..."
            }
          ]

        :reqheader Accept: application/json
        :<json string title: post title
        :<json string body: post body
        :<json string author: author id
        :<json List[string] tags: tags list
        :>json int: id
        :resheader Content-Type: application/json
        :status 200: posts found
        :status 201: post created
        :status 400: malformed request
        :status 422: invalid parameters


        """
        """

        :rtype: APIResponse
        :param:

          **POST BODY**

          ::

              {
                  "ip": "127.0.0.1",
                  "port" : "9200",
                  "use_ssl: true
              }

          **Request Structure**

          - *(dict) --*

            - **ip** *(string) --* IP address or host name

            - **port** *(string) --* ES REST API port

            - **use_ssl** *(boolean) --* Whether to use HTTPS or not.

        """
        json_data = request.get_json(force=True)
        params = request.values.to_dict()
        params.update(json_data)

        if params.get('ip', None) is None:
            raise BadRequest(message='Missing required parameters.')

        scheme = 'http'
        if params.get('use_ssl', False) is True:
            scheme = 'https'

        response = ConnectionService().create_connection(ip=params['ip'], port=params.get('port', "9200"),
                                                         scheme=scheme)

        schema = ClusterDTO(many=False)
        result = schema.dump(response)
        return APIResponse(result.data, HTTP_Status.CREATED, None)

    @request_wrapper
    def delete(self, cluster_name):
        """
        Deletes a connection from the connection pool and the database, by cluster name.

        :type cluster_name: string
        :param cluster_name: the name of the cluster.
        :return: APIResponse
        :rtype: elastichq.common.api_response.APIResponse
        :rtype: :class: `elastichq.common.api_response.APIResponse`
        """
        response = ConnectionService().delete_connection(cluster_name)
        return APIResponse(response, HTTP_Status.OK, None)


class ClusterList(Resource):
    """
    Retrieves a list of all active and inactive cluster connections.
    """

    @request_wrapper
    def get(self):
        """
        Retrieves a list of all active and inactive cluster connections.

        :return:

          **POST BODY**

          ::

              {
                  "ip": "127.0.0.1",
                  "port" : "9200",
                  "use_ssl: true
              }

          **Request Structure**

          - *(dict) --*

            - **ip** *(string) --* IP address or host name

            - **port** *(string) --* ES REST API port

            - **use_ssl** *(boolean) --* Whether to use HTTPS or not.

        """
        response = ClusterService().get_clusters()

        schema = ClusterDTO(many=True)
        result = schema.dump(response)
        return APIResponse(result.data, HTTP_Status.OK, None)


class ClusterHealth(Resource):
    """
    qq
    """

    @request_wrapper
    def get(self, cluster_name):
        """
        Returns cluster health 
        :param cluster_name: 
        :return:
        """

        response = ClusterService().get_cluster_health(cluster_name)
        return APIResponse(response, HTTP_Status.OK, None)


class ClusterState(Resource):
    """
    q
    """

    @request_wrapper
    def get(self, cluster_name):
        """Return collection of posts.

        .. :quickref: Posts Collection; Get collection of posts.

        **Example request**:

        .. sourcecode:: http

          GET /posts/ HTTP/1.1
          Host: example.com
          Accept: application/json

        **Example response**:

        .. sourcecode:: http

          HTTP/1.1 200 OK
          Vary: Accept
          Content-Type: application/json

          [
            {
              "post_id": 12345,
              "author": "/author/123/",
              "tags": ["sphinx", "rst", "flask"],
              "title": "Documenting API in Sphinx with httpdomain",
              "body": "How to..."
            },
            {
              "post_id": 12346,
              "author": "/author/123/",
              "tags": ["python3", "typehints", "annotations"],
              "title": "To typehint or not to typehint that is the question",
              "body": "Static checking in python..."
            }
          ]

        :reqheader Accept: application/json
        :<json string title: post title
        :<json string body: post body
        :<json string author: author id
        :<json List[string] tags: tags list
        :>json int: id
        :resheader Content-Type: application/json
        :status 200: posts found
        :status 201: post created
        :status 400: malformed request
        :status 422: invalid parameters


        """
        response = ClusterService().get_cluster_state(cluster_name)
        return APIResponse(response, HTTP_Status.OK, None)


class ClusterSummary(Resource):
    """
    Brief summary for a given cluster name
    """

    @request_wrapper
    def get(self, cluster_name):
        response = ClusterService().get_cluster_summary(cluster_name)
        return APIResponse(response, HTTP_Status.OK, None)


class ClusterStats(Resource):
    @request_wrapper
    def get(self, cluster_name):
        response = ClusterService().get_cluster_stats(cluster_name)
        return APIResponse(response, HTTP_Status.OK, None)


class ClusterPendingTasks(Resource):
    @request_wrapper
    def get(self, cluster_name):
        response = ClusterService().get_cluster_pending_tasks(cluster_name)
        return APIResponse(response, HTTP_Status.OK, None)


class ClusterSettings(Resource):

    @request_wrapper
    def get(self, cluster_name):
        response = ClusterService().get_cluster_settings(cluster_name)
        return APIResponse(response, HTTP_Status.OK, None)

    @request_wrapper
    def put(self, cluster_name):
        json_data = request.get_json(force=True)
        response = ClusterService().put_cluster_settings(json_data, cluster_name)
        return APIResponse(response, HTTP_Status.OK, None)


api.add_resource(ClusterConnection, '/clusters/_connect', '/clusters/<string:cluster_name>/_connect',
                 endpoint='clusters', methods=['POST', 'DELETE'])
api.add_resource(ClusterList, '/clusters', endpoint='clusters_list', methods=['GET'])
api.add_resource(ClusterStats, '/clusters/<string:cluster_name>/_stats', endpoint='clusters_stats', methods=['GET'])
api.add_resource(ClusterHealth, '/clusters/<string:cluster_name>/_health', endpoint='clusters_health', methods=['GET'])
api.add_resource(ClusterSummary, '/clusters/<string:cluster_name>/_summary', endpoint='clusters_summary',
                 methods=['GET'])
api.add_resource(ClusterState, '/clusters/<string:cluster_name>/_state', endpoint='clusters_state', methods=['GET'])
api.add_resource(ClusterPendingTasks, '/clusters/<string:cluster_name>/_pending_tasks',
                 endpoint='clusters_pending_tasks', methods=['GET'])
api.add_resource(ClusterSettings, '/clusters/<string:cluster_name>/_settings', endpoint='clusters_settings',
                 methods=['GET', 'PUT'])
