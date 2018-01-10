__author__ = 'royrusso'

import json

from requests import Timeout
import requests

from elastichq.globals import CONNECTIONS, REQUEST_TIMEOUT


class ClusterService:
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

    def put_cluster_settings(self, settings, cluster_name):
        connection = CONNECTIONS.get_connection(cluster_name)
        return connection.cluster.put_settings(body=settings, request_timeout=REQUEST_TIMEOUT)

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
