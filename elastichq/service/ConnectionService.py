__author__ = 'royrusso'

import json

import requests

from ..globals import CONNECTIONS, REQUEST_TIMEOUT
from ..vendor.elasticsearch import Elasticsearch
from elastichq.model import ClusterModel
from elastichq.service.persistence import ClusterDBService


class ConnectionService:
    """
    Manages connection pools to all clusters
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

        # SAVE to Connection Pools
        # TODO: configure timeout
        conn = Elasticsearch(hosts=[scheme + "://" + ip + ":" + port], maxsize=5, version=content.get('version').get('number'))
        CONNECTIONS.add_connection(alias=content.get('cluster_name'), conn=conn)

        content['connection_created'] = True
        content['host'] = conn.transport.seed_connections[0].host

        # SAVE to DB
        cluster_model = ClusterModel(content.get("cluster_name"), content['host'])
        ClusterDBService().save_cluster(cluster_model)

        # TODO: Should be returning the cluster model, or some merged version of both?
        return content

    def delete_connection(self, cluster_name):
        cluster_names = []
        if cluster_name == '_all':
            for connection in CONNECTIONS._conns:
                cluster_names.append(connection)
            for name in cluster_names:
                ClusterDBService().delete_cluster_by_name(name)
                CONNECTIONS.remove_connection(name)
        else:
            ClusterDBService().delete_cluster_by_name(cluster_name)
            CONNECTIONS.remove_connection(cluster_name)
        return
