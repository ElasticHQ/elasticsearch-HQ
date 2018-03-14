__author__ = 'royrusso'

from elastichq.service import ConnectionService


class SnapshotService:

    def get_repositories(self, cluster_name):
        connection = ConnectionService().get_connection(cluster_name)
        return connection.snapshot.get_repository()
