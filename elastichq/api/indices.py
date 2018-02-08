"""
.. module:: indices

.. moduleauthor:: Roy Russo <royrusso.gmail.com>
"""

from flask import request
from flask_restful import Resource

from . import api
from ..common.api_response import APIResponse
from ..common.exceptions import request_wrapper
from ..common.status_codes import HTTP_Status
from ..service import IndicesService


class IndexSummary(Resource):
    @request_wrapper
    def get(self, cluster_name, index_names=None):
        """
        Generate a summary view of one index for the UI.

        :param cluster_name:
        :param index_names:
        :return:
        """
        response = IndicesService().get_indices_summary(cluster_name, index_names)
        return APIResponse(response, HTTP_Status.OK, None)


class IndexStats(Resource):
    @request_wrapper
    def get(self, cluster_name, index_names=None):
        """
        Wrapper around https://www.elastic.co/guide/en/elasticsearch/reference/current/indices-stats.html

        :param cluster_name:
        :param index_names:
        :return:
        """
        response = IndicesService().get_indices_stats(cluster_name, index_names)
        return APIResponse(response, HTTP_Status.OK, None)


class Index(Resource):
    @request_wrapper
    def get(self, cluster_name, index_name=None):
        """
        Wrapper around https://www.elastic.co/guide/en/elasticsearch/reference/current/indices-get-index.html

        :param cluster_name:
        :param index_name:
        :return:
        """
        response = IndicesService().get_indices(cluster_name, index_name)
        return APIResponse(response, HTTP_Status.OK, None)

    #
    # @request_wrapper
    # def delete(self, cluster_name, index_name):
    #     response = IndicesService().delete_indices(cluster_name, index_name)
    #     return APIResponse(response, HTTP_Status.OK, None)

    @request_wrapper
    def post(self, cluster_name, index_name):
        """
        Creates a new index on the cluster.

        :param cluster_name:
        :param index_name:

        **Example request**:

        .. sourcecode:: http

          POST /api/indices/<cluster_name>/ HTTP/1.1
          Accept: application/json

        .. code-block:: json

            {
                "settings":
                    {
                        "number_of_replicas": 2,
                        "number_of_shards": 4
                    }
            }

        **Request Structure**

          - *(dict) --*

            - **number_of_shards** *(string) --*
            - **number_of_replicas** *(string) --*

        :reqheader Accept: application/json
        :resheader Content-Type: application/json
        :status 201: index created
        :status 400: bad request
        :status 500: server error

        :return:
        """
        json_data = request.get_json(force=True)
        params = request.values.to_dict()
        params.update(json_data)

        response = IndicesService().create_index(cluster_name, index_name, settings=params.get('settings'))
        return APIResponse(response, HTTP_Status.OK, None)


class IndexAction(Resource):
    @request_wrapper
    def put(self, cluster_name, action, index_name=None):
        """
        Trigger a command on one or many indices.

        The possible commands are:

        * _open - Opens the Index for writes.
        * _close - Closed the index for writes.
        * _flush - Flushes caches
        * _refresh - Refresh the searchable data.
        * _force_merge - Formerly known as _optimize. Forces a segment merge.
        * _expunge_deleted - Forces deleted documents to be removed from disk.

        :param cluster_name:
        :type action: string
        :param action: One of _open, _close, _flush, _refresh, _cache, _force_merge, _expunge_deleted
        :param index_name:
        :return:
        """
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
        elif action == '_force_merge':
            response = IndicesService().force_merge(cluster_name, index_name)
        elif action == '_expunge_deleted':
            response = IndicesService().expunge_deleted(cluster_name, index_name)
        else:
            return APIResponse(response, HTTP_Status.NOT_FOUND, None)

        return APIResponse(response, HTTP_Status.OK, None)


class IndexAlias(Resource):
    @request_wrapper
    def get(self, cluster_name, index_name=None):
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
        """
        Deletes an alias.

        :param cluster_name: 
        :param index_name:
        :type alias_name: string
        :param alias_name: Alias to delete
        :return:
        """
        response = IndicesService().remove_alias(cluster_name, index_name, alias_name)
        return APIResponse(response, HTTP_Status.OK, None)

    @request_wrapper
    def post(self, cluster_name, index_name, alias_name):
        """
        Creates a new alias.

        :param cluster_name: 
        :param index_name:
        :type alias_name: string
        :param alias_name: 
        :return:
        """
        response = IndicesService().create_alias(cluster_name, index_name, alias_name)
        return APIResponse(response, HTTP_Status.OK, None)


class IndexMapping(Resource):
    @request_wrapper
    def get(self, cluster_name, index_name, mapping_name=None):
        """
        Returns one (or many) mappings that are found in the index.

        :param cluster_name:
        :param index_name:
        :type mapping_name: string
        :param mapping_name: Mapping for only this doc type.
        :return:
        """
        response = IndicesService().get_mapping(cluster_name, index_name, mapping_name)
        return APIResponse(response, HTTP_Status.OK, None)


class IndexShards(Resource):
    @request_wrapper
    def get(self, cluster_name, index_names=None):
        """
        Return shard information for this index.

        :param cluster_name:
        :param index_names:
        :return:
        """
        response = IndicesService().get_shards(cluster_name, index_names)
        return APIResponse(response, HTTP_Status.OK, None)


api.add_resource(IndexAction, '/indices/<string:cluster_name>/<string:index_name>/action/<string:action>',
                 '/indices/<string:cluster_name>/action/<string:action>', endpoint='index_command', methods=['PUT'])
api.add_resource(Index, '/indices/<string:cluster_name>/<string:index_name>', '/indices/<string:cluster_name>',
                 endpoint='indices', methods=['GET', 'POST'])
api.add_resource(IndexStats, '/indices/<string:cluster_name>/<string:index_names>/_stats',
                 '/indices/<string:cluster_name>/_stats', endpoint='indices_stats', methods=['GET'])
api.add_resource(IndexShards, '/indices/<string:cluster_name>/<string:index_names>/_shards',
                 '/indices/<string:cluster_name>/_shards', endpoint='indices_shards', methods=['GET'])
api.add_resource(IndexSummary, '/indices/<string:cluster_name>/<string:index_names>/_summary',
                 '/indices/<string:cluster_name>/_summary', endpoint='indices_summary',
                 methods=['GET'])

api.add_resource(IndexAlias, '/indices/<string:cluster_name>/<string:index_name>/_aliases',
                 '/indices/<string:cluster_name>/<string:index_name>/<string:alias_name>/_aliases',
                 '/indices/<string:cluster_name>/_aliases', endpoint='index_alias',
                 methods=['GET', 'DELETE', 'POST'])
api.add_resource(IndexMapping, '/indices/<string:cluster_name>/<string:index_name>/_mapping',
                 '/indices/<string:cluster_name>/<string:index_name>/_mapping/<string:mapping_name>',
                 endpoint='index_mapping', methods=['GET'])
