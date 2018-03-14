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
}

export default ClusterRepositoriesService;
