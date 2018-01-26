class ClusterIndicesService {

    // Imports go here
    constructor(QueuedFactory) {
        'ngInject';

        this.que = QueuedFactory;
    }

    clusterInidices(cluster_name) {
        return this.que.add({
            url: '/api/indices/' + cluster_name + '/_summary',
            method: 'GET'
        });
    }

    clusterIndice(cluster_name, index_name) {
        // /api/indices/[cluster_name]/[index_name]
        return this.que.add({
            url: '/api/indices/' + cluster_name + '/' + index_name,
            method: 'GET'
        });
    }

    clusterIndiceSummary(cluster_name, index_name) {
        // /api/indices/[cluster_name]/[index_name]
        return this.que.add({
            url: '/api/indices/' + cluster_name + '/' + index_name + '/_summary',
            method: 'GET'
        });
    }

    clusterIndiceStats(cluster_name, index_name) {
        // /api/indices/[cluster_name]/[index_name]
        return this.que.add({
            url: '/api/indices/' + cluster_name + '/' + index_name + '/_stats',
            method: 'GET'
        });
    }

    clusterIndiceMappings(cluster_name, index_name) {
        // /api/indices/[cluster_name]/[index_name]
        return this.que.add({
            url: '/api/indices/' + cluster_name + '/' + index_name + '/_mapping',
            method: 'GET'
        });
    }

    clusterIndiceShards(cluster_name, index_name) {
        // /api/indices/[cluster_name]/[index_name]
        return this.que.add({
            url: '/api/indices/' + cluster_name + '/' + index_name + '/_shards',
            method: 'GET'
        });
    }

    clusterIndiceAliases(cluster_name, index_name, alias_name) {
        // /api/indices/[cluster_name]/[index_name]/[alias_name]
        return this.que.add({
            url: '/api/indices/' + cluster_name + '/' + index_name + '/_aliases',
            method: 'GET'
        });
    }

    clusterIndicesClearCache(cluster_name, index_name) {
        if (index_name === undefined) {
            return this.que.add({
                url: '/api/indices/' + cluster_name + '/action/_cache',
                method: 'PUT'
            });
        }
        else {
            return this.que.add({
                url: '/api/indices/' + cluster_name + '/' + index_name + '/action/_cache',
                method: 'PUT'
            });
        }
    }

    clusterIndicesRefresh(cluster_name, index_name) {
        if (index_name === undefined) {
            return this.que.add({
                url: '/api/indices/' + cluster_name + '/action/_refresh',
                method: 'PUT'
            });
        }
        else {
            return this.que.add({
                url: '/api/indices/' + cluster_name + '/' + index_name + '/action/_refresh',
                method: 'PUT'
            });
        }
    }

    clusterIndicesFlush(cluster_name, index_name) {
        if (index_name === undefined) {
            return this.que.add({
                url: '/api/indices/' + cluster_name + '/action/_flush',
                method: 'PUT'
            });
        }
        else {
            return this.que.add({
                url: '/api/indices/' + cluster_name + '/' + index_name + '/action/_flush',
                method: 'PUT'
            });
        }
    }

    clusterIndicesForceMerge(cluster_name, index_name) {
        if (index_name === undefined) {
            return this.que.add({
                url: '/api/indices/' + cluster_name + '/action/_force_merge',
                method: 'PUT'
            });
        }
        else {
            return this.que.add({
                url: '/api/indices/' + cluster_name + '/' + index_name + '/action/_force_merge',
                method: 'PUT'
            });
        }
    }

}

export default ClusterIndicesService;
