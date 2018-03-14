__author__ = 'royrusso'

from elastichq.service import ConnectionService


class SnapshotService:

    def get_repositories(self, cluster_name):
        connection = ConnectionService().get_connection(cluster_name)
        repos = connection.snapshot.get_repository()

        data = []
        for repo in repos:
            repo_type = repos.get(repo).get('type', None)
            repo_item = {'repository_name': repo, 'repository_type': repo_type}
            data.append(repo_item)
        return data
