__author__ = 'royrusso'

import json

import requests

from ..constants import CONNECTIONS
from ..vendor.elasticsearch import Elasticsearch


class ClusterService:
    def create_connection(self, ip, port, scheme='http'):
        # determine version first
        response = requests.get(scheme + "://" + ip + ":" + port)
        content = json.loads(response.content.decode('utf-8'))

        # TODO: is supported version?

        # assuming supported, create connection pool with alias.
        # TODO: configure timeout
        conn = Elasticsearch(hosts=[scheme + "://" + ip + ":" + port], maxsize=5, version=content.get('version').get('number'))
        CONNECTIONS.add_connection(alias=content.get('cluster_name'), conn=conn)

        content['connection_created'] = True
        return content

    def get_cluster_health(self, cluster_name):
        connection = CONNECTIONS.get_connection(cluster_name)

        return connection.cluster.health()
