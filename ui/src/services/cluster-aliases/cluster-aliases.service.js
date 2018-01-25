class ClusterAliasesService {

    // Imports go here
    constructor(QueuedFactory) {
        'ngInject';

        this.que = QueuedFactory;
    }

    clusterAliases(cluster_name) {
        return this.que.add({
            url: '/api/indices/' + cluster_name + '/_aliases',
            method: 'GET'
        });
    }

}

export default ClusterAliasesService;
