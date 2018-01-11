__author__ = 'royrusso'

from flask_restful import Resource
from flask import request

from ..common.status_codes import HTTP_Status
from . import api
from ..common.api_response import APIResponse
from ..service import ConnectionService, ClusterService
from ..common.exceptions import request_wrapper, BadRequest
from elastichq.model import ClusterDTO


class ClusterConnection(Resource):
    @request_wrapper
    def post(self):
        """
        Creates a connection to a given host/port. Accepts a JSON POST BODY
        :arg: ip: Host IP
        :arg: port: Port. Defaults to 9200
        :arg: use_ssl: optional argument indicates scheme
        :return:
        """
        json_data = request.get_json(force=True)
        params = request.values.to_dict()
        params.update(json_data)

        if params.get('ip', None) is None:
            raise BadRequest(message='Missing required parameters.')

        scheme = 'http'
        if params.get('use_ssl', False) is True:
            scheme = 'https'

        response = ConnectionService().create_connection(ip=params['ip'], port=params.get('port', "9200"), scheme=scheme)

        schema = ClusterDTO(many=False)
        result = schema.dump(response)
        return APIResponse(result.data, HTTP_Status.CREATED, None)

    @request_wrapper
    def delete(self, cluster_name):
        """
        Deletes a connection from the connection pool, given a cluster name
        :return:
        """
        response = ConnectionService().delete_connection(cluster_name)
        return APIResponse(response, HTTP_Status.OK, None)


class ClusterList(Resource):
    """
    Retrieves a list of all active and inactive cluster connections.
    """

    @request_wrapper
    def get(self):
        response = ClusterService().get_clusters()

        schema = ClusterDTO(many=True)
        result = schema.dump(response)
        return APIResponse(result.data, HTTP_Status.OK, None)


class ClusterHealth(Resource):
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
    @request_wrapper
    def get(self, cluster_name):
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


api.add_resource(ClusterConnection, '/clusters/_connect', '/clusters/<string:cluster_name>/_connect', endpoint='clusters', methods=['POST', 'DELETE'])
api.add_resource(ClusterList, '/clusters', endpoint='clusters_list', methods=['GET'])
api.add_resource(ClusterStats, '/clusters/<string:cluster_name>/_stats', endpoint='clusters_stats', methods=['GET'])
api.add_resource(ClusterHealth, '/clusters/<string:cluster_name>/_health', endpoint='clusters_health', methods=['GET'])
api.add_resource(ClusterSummary, '/clusters/<string:cluster_name>/_summary', endpoint='clusters_summary', methods=['GET'])
api.add_resource(ClusterState, '/clusters/<string:cluster_name>/_state', endpoint='clusters_state', methods=['GET'])
# api.add_resource(ClusterPendingTasks, '/clusters/<string:cluster_name>/_pending_tasks', endpoint='clusters_pending_tasks', methods=['GET'])
# api.add_resource(ClusterSettings, '/clusters/<string:cluster_name>/_settings', endpoint='clusters_settings', methods=['GET', 'PUT'])
