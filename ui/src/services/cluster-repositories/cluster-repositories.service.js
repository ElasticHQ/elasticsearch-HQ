class ClusterRepositoriesService {

    // Imports go here
    constructor(QueuedFactory) {
        'ngInject';

        this.que = QueuedFactory;
    }

    clusterRepositories(cluster_name) {
        return this.que.add({
            url: 'api/repositories/' + cluster_name,
            method: 'GET'
        });
    }

    clusterSnapshots(cluster_name, repositoryName) {
        return this.que.add({
            url: 'api/snapshots/' + cluster_name + '/repository/' + repositoryName,
            method: 'GET'
        });
    }
}

export default ClusterRepositoriesService;
