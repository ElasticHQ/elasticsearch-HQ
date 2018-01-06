__author__ = 'royrusso'

import json

from requests import Timeout
import requests

from ..globals import CONNECTIONS, REQUEST_TIMEOUT
from ..vendor.elasticsearch import Elasticsearch


class ClusterService:
    """
    Many of the these service calls mirror Cluster API <https://www.elastic.co/guide/en/elasticsearch/reference/master/cluster.html>. In addition, this service also handles our 
    connection poos to all configured clusters.
    """

    def create_connection(self, ip, port, scheme='http'):
        """
        Creates a connection with a cluster and place the connection inside of a connection pool, using the cluster_name as an alias.
        
        :param ip: 
        :param port: 
        :param scheme: 
        :return:
        """
        # determine version first
        response = requests.get(scheme + "://" + ip + ":" + port, timeout=REQUEST_TIMEOUT)
        content = json.loads(response.content.decode('utf-8'))

        # TODO: is supported version?

        # assuming supported, create connection pool with alias.
        # TODO: configure timeout
        conn = Elasticsearch(hosts=[scheme + "://" + ip + ":" + port], maxsize=5, version=content.get('version').get('number'))
        CONNECTIONS.add_connection(alias=content.get('cluster_name'), conn=conn)

        content['connection_created'] = True
        content['host'] = conn.transport.seed_connections[0].host

        return content

    def get_cluster_health(self, cluster_name):
        connection = CONNECTIONS.get_connection(cluster_name)
        return connection.cluster.health(request_timeout=REQUEST_TIMEOUT)

    def get_cluster_state(self, cluster_name):
        connection = CONNECTIONS.get_connection(cluster_name)
        return connection.cluster.state(request_timeout=REQUEST_TIMEOUT)

    def get_cluster_stats(self, cluster_name):
        connection = CONNECTIONS.get_connection(cluster_name)
        return connection.cluster.stats(request_timeout=REQUEST_TIMEOUT)

    def get_cluster_pending_tasks(self, cluster_name):
        connection = CONNECTIONS.get_connection(cluster_name)
        return connection.cluster.pending_tasks(request_timeout=REQUEST_TIMEOUT)

    def get_cluster_settings(self, cluster_name):
        connection = CONNECTIONS.get_connection(cluster_name)
        return connection.cluster.get_settings(include_defaults=True, request_timeout=REQUEST_TIMEOUT)

    def get_clusters(self):
        """
        Returns a list of clusters from the connection pool
        :return:
        """
        res = []
        for connection in CONNECTIONS._conns:
            conn = CONNECTIONS.get_connection(connection)
            try:
                response = requests.get(conn.transport.seed_connections[0].host, timeout=REQUEST_TIMEOUT)
                content = json.loads(response.content.decode('utf-8'))
                content['timed_out'] = False
            except Timeout as toe:
                content = {"cluster_name": connection, "timed_out": True, "version": {"number": conn.version}}
            content['host'] = conn.transport.seed_connections[0].host

            res.append(content)
        return res

    def delete_connection(self, cluster_name):
        CONNECTIONS.remove_connection(cluster_name)
        return
