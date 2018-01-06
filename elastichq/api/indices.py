__author__ = 'royrusso'

from flask_restful import Resource
from flask import request

from ..common.status_codes import HTTP_Status
from . import api
from ..common.api_response import APIResponse
from ..service import IndicesService
from ..common.exceptions import request_wrapper


class IndexStats(Resource):
    @request_wrapper
    def get(self, cluster_name, index_names=None):
        response = IndicesService().get_indices_stats(cluster_name, index_names)
        return APIResponse(response, HTTP_Status.OK, None)


class IndexList(Resource):
    @request_wrapper
    def get(self, cluster_name, index_name=None):
        response = IndicesService().get_indices(cluster_name, index_name)
        return APIResponse(response, HTTP_Status.OK, None)


class Index(Resource):
    @request_wrapper
    def get(self, cluster_name, index_name):
        response = IndicesService().get_indices(cluster_name, index_name)
        return APIResponse(response, HTTP_Status.OK, None)

    @request_wrapper
    def delete(self, cluster_name, index_name):
        response = IndicesService().delete_indices(cluster_name, index_name)
        return APIResponse(response, HTTP_Status.OK, None)

    @request_wrapper
    def post(self, cluster_name, index_name):
        json_data = request.get_json(force=True)
        params = request.values.to_dict()
        params.update(json_data)

        response = IndicesService().create_index(cluster_name, index_name, settings=params.get('settings'))
        return APIResponse(response, HTTP_Status.OK, None)


class IndexAction(Resource):
    @request_wrapper
    def put(self, cluster_name, index_name, action):
        response = {}

        if action == '_open':
            response = IndicesService().open_index(cluster_name, index_name)
        elif action == '_close':
            response = IndicesService().close_index(cluster_name, index_name)
        elif action == '_flush':
            response = IndicesService().flush_index(cluster_name, index_name)
        elif action == '_refresh':
            response = IndicesService().refresh_index(cluster_name, index_name)
        elif action == '_cache':
            response = IndicesService().clear_cache(cluster_name, index_name)
        elif action == '_forcemerge':
            response = IndicesService().force_merge(cluster_name, index_name)

        return APIResponse(response, HTTP_Status.OK, None)


class IndexAlias(Resource):
    @request_wrapper
    def get(self, cluster_name, index_name, alias_name=None):
        """
        Get all aliases for this index
        :param cluster_name: 
        :param index_name: 
        :return:
        """
        response = IndicesService().get_alias(cluster_name, index_name)
        return APIResponse(response, HTTP_Status.OK, None)

    @request_wrapper
    def delete(self, cluster_name, index_name, alias_name):
        response = IndicesService().remove_alias(cluster_name, index_name, alias_name)
        return APIResponse(response, HTTP_Status.OK, None)

    @request_wrapper
    def post(self, cluster_name, index_name, alias_name):
        response = IndicesService().create_alias(cluster_name, index_name, alias_name)
        return APIResponse(response, HTTP_Status.OK, None)


class IndexMapping(Resource):
    @request_wrapper
    def get(self, cluster_name, index_name, mapping_name):
        response = IndicesService().get_mapping(cluster_name, index_name, mapping_name)
        return APIResponse(response, HTTP_Status.OK, None)


api.add_resource(IndexAction, '/indices/<string:cluster_name>/<string:index_name>/action/<string:action>', endpoint='index_command', methods=['GET'])
api.add_resource(Index, '/indices/<string:cluster_name>/<string:index_name>', endpoint='index', methods=['GET', 'DELETE', 'POST'])
api.add_resource(IndexStats, '/indices/<string:cluster_name>/<string:index_names>/_stats', '/indices/<string:cluster_name>/_stats', endpoint='indices_stats', methods=['GET'])
api.add_resource(IndexList, '/indices/<string:cluster_name>/<string:index_name>', '/indices/<string:cluster_name>', endpoint='indices', methods=['GET'])
api.add_resource(IndexAlias, '/indices/<string:cluster_name>/<string:index_name>/_alias/<string:alias_name>', endpoint='index_alias', methods=['GET', 'DELETE', 'POST'])
api.add_resource(IndexMapping, '/indices/<string:cluster_name>/<string:index_name>/_mapping/<string:mapping_name>', endpoint='index_mapping', methods=['GET'])
