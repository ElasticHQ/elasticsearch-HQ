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

    clusterAliasesDelete(cluster_name, index_name, alias_name) {
        // /api/indices/[cluster_name]/[index_name]
        return this.que.add({
            url: '/api/indices/' + cluster_name + '/' + index_name + '/' + alias_name + '/_aliases',
            method: 'DELETE'
        });
    }

    clusterAliasesCreate(cluster_name, index_name, alias_name) {
        return this.que.add({
            url: '/api/indices/' + cluster_name + '/' + index_name + '/' + alias_name + '/_aliases',
            method: 'POST'
        });
    }

}

export default ClusterAliasesService;
