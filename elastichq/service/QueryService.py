"""
.. module:: QueryService

.. moduleauthor:: Roy Russo <royrusso.gmail.com>
"""

from elastichq.globals import REQUEST_TIMEOUT
from .ConnectionService import ConnectionService


class QueryService:

    def run_query(self, cluster_name, index_name, query_json):
        connection = ConnectionService().get_connection(cluster_name)

        if connection.version.startswith("2"):
            from elastichq.vendor.elasticsearch_dsl.v2.elasticsearch_dsl import Search
            search = Search(using=connection, index=index_name).params(request_timeout=REQUEST_TIMEOUT)
            search.update_from_dict(query_json)
            es_results = search.execute()
        elif connection.version.startswith("5"):
            from elastichq.vendor.elasticsearch_dsl.v5.elasticsearch_dsl import Search
            search = Search(using=connection, index=index_name).params(request_timeout=REQUEST_TIMEOUT)
            search.update_from_dict(query_json)
            es_results = search.execute()
        elif connection.version.startswith("6"):
            from elastichq.vendor.elasticsearch_dsl.v6.elasticsearch_dsl import Search
            search = Search(using=connection, index=index_name).params(request_timeout=REQUEST_TIMEOUT)
            search.update_from_dict(query_json)
            es_results = search.execute()
        else:  # assume latest in cascade
            from elastichq.vendor.elasticsearch_dsl.v6.elasticsearch_dsl import Search
            search = Search(using=connection, index=index_name).params(request_timeout=REQUEST_TIMEOUT)
            search.update_from_dict(query_json)
            es_results = search.execute()

        return es_results.to_dict()

    def get_by_id(self, cluster_name, index_name, doc_id, doc_type='_all'):
        connection = ConnectionService().get_connection(cluster_name)
        return connection.get(index_name, doc_type=doc_type, id=doc_id)

    def get_source_by_id(self, cluster_name, index_name, doc_id, doc_type='_all'):
        connection = ConnectionService().get_connection(cluster_name)
        return connection.get_source(index_name, doc_type=doc_type, id=doc_id)
