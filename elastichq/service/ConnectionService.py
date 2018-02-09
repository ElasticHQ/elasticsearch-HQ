__author__ = 'royrusso'

import json

import requests
from requests.exceptions import ConnectionError

from elastichq.model import ClusterModel
from elastichq.service.persistence import ClusterDBService
from ..globals import CONNECTIONS, LOG, REQUEST_TIMEOUT
from ..vendor.elasticsearch import Elasticsearch
from ..vendor.elasticsearch.connections import ConnectionNotFoundException


class ConnectionService:
    """
    Manages connection pools to all clusters. This class serves as an interface to the ES Connections object.
    """

    def ping(self, ip, port, scheme='http'):
        try:
            response = requests.get(scheme + "://" + ip + ":" + port, timeout=3)
            return True
        except Exception as e:
            return False

    def create_connection(self, ip, port, scheme='http', username=None, password=None):
        """
        Creates a connection with a cluster and place the connection inside of a connection pool, using the cluster_name as an alias.
        :param ip: 
        :param port: 
        :param scheme: 
        :return:
        """
        try:
            is_basic_auth = False
            if username is not None and password is not None:
                is_basic_auth = True

            # determine version first
            if is_basic_auth is True:
                response = requests.get(scheme + "://" + ip + ":" + port, auth=(username, password),
                                        timeout=REQUEST_TIMEOUT)
            else:
                response = requests.get(scheme + "://" + ip + ":" + port, timeout=REQUEST_TIMEOUT)

            content = json.loads(response.content.decode('utf-8'))

            # SAVE to Connection Pools
            if is_basic_auth is True:
                conn = Elasticsearch(hosts=[scheme + "://" + ip + ":" + port], maxsize=5,
                                     version=content.get('version').get('number'), http_auth=(username, password))
            else:
                conn = Elasticsearch(hosts=[scheme + "://" + ip + ":" + port], maxsize=5,
                                     version=content.get('version').get('number'))

            self.add_connection(content.get('cluster_name'), conn=conn)

            # SAVE to DB
            cluster_model = ClusterModel(content.get("cluster_name"), cluster_ip=ip, cluster_port=port,
                                         cluster_scheme=scheme, username=username, password=password)
            cluster_model.cluster_version = content.get('version').get('number')
            cluster_model.cluster_connected = True
            ClusterDBService().save_cluster(cluster_model)
            return cluster_model
        except Exception as ex:
            LOG.error("Unable to create connection!", ex)
            return None

    def add_connection(self, cluster_name, conn):
        CONNECTIONS.add_connection(alias=cluster_name, conn=conn)

    def get_connections(self, create_if_missing=True):
        clusters = ClusterDBService().get_all()

        for cluster in clusters:
            # create throws requests.exceptions.ConnectionError if it can't connect.
            try:
                if self.ping(cluster.cluster_ip, cluster.cluster_port, cluster.cluster_scheme) is True:
                    self.get_connection(cluster.cluster_name, create_if_missing=create_if_missing)
                    cluster.cluster_connected = True
                else:
                    cluster.cluster_connected = False
            except ConnectionError as ce:
                cluster.cluster_connected = False
            except ConnectionNotFoundException as cfe:
                cluster.cluster_connected = False
        return clusters

    def get_connection(self, cluster_name, create_if_missing=True):
        """
        Interface for cluster connection pool object. If a connection does not exist, it will attempt to create it, using what is stored in the database. If it cannot find the connection 
        or cannot create one from the database, it will throw a ConnectionNotFoundException
        :param cluster_name: 
        :param create_if_missing: Will create the connection in the connection pool AND the persistence layer if it does not exist.
        :return:
        """
        try:
            return CONNECTIONS.get_connection(cluster_name)
        except ConnectionNotFoundException as cnfe:
            if create_if_missing is True:
                cluster = ClusterDBService().get_by_id(cluster_name)
                if cluster is not None:
                    try:
                        if cluster.is_basic_auth is True:
                            self.create_connection(ip=cluster.cluster_ip, port=cluster.cluster_port,
                                                   scheme=cluster.cluster_scheme, username=cluster.cluster_username, password=cluster.cluster_password)
                        else:
                            self.create_connection(ip=cluster.cluster_ip, port=cluster.cluster_port,
                                                   scheme=cluster.cluster_scheme)
                        return CONNECTIONS.get_connection(
                            cluster_name)  # this will throw a connection not found exception for us.
                    except ConnectionError as ce:
                        LOG.error('There is no connection with alias %r.' % cluster_name)
                        raise ConnectionNotFoundException('There is no connection with alias %r.' % cluster_name)
            else:
                LOG.error('There is no connection with alias %r.' % cluster_name)
                raise ConnectionNotFoundException('There is no connection with alias %r.' % cluster_name)

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
            try:
                CONNECTIONS.remove_connection(cluster_name)
            except Exception as ex:
                LOG.error("Connection does not exist: " + cluster_name)
        return
