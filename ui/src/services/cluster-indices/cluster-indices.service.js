class ClusterIndicesService {

    // Imports go here
    constructor(QueuedFactory) {
        'ngInject';

        this.que = QueuedFactory;
    }

    clusterInidices(cluster_name) {
        return this.que.add({
            url: 'api/indices/' + cluster_name + '/_summary',
            method: 'GET'
        });
    }

    clusterIndice(cluster_name, index_name) {
        // api/indices/[cluster_name]/[index_name]
        return this.que.add({
            url: 'api/indices/' + cluster_name + '/' + index_name,
            method: 'GET'
        });
    }

    clusterIndicesListClosed(cluster_name) {
        // api/indices/[cluster_name]/[index_name]
        return this.que.add({
            url: 'api/indices/' + cluster_name + '/_closed',
            method: 'GET'
        });
    }


    clusterIndicesListDeleted(cluster_name) {
        // api/indices/[cluster_name]/[index_name]
        return this.que.add({
            url: 'api/indices/' + cluster_name + '/_deleted',
            method: 'GET'
        });
    }

    clusterIndexReindex(cluster_name, settings) {
        return this.que.add({
            url: 'api/indices/' + cluster_name + '/_reindex',
            method: 'POST',
            data: settings
        });
    }

    clusterIndexCreate(cluster_name, index_name, settings) {
        return this.que.add({
            url: 'api/indices/' + cluster_name + '/' + index_name,
            method: 'POST',
            data: settings
        });
    }

    clusterIndiceSummary(cluster_name, index_name) {
        // api/indices/[cluster_name]/[index_name]
        return this.que.add({
            url: 'api/indices/' + cluster_name + '/' + index_name + '/_summary',
            method: 'GET'
        });
    }

    clusterIndiceStats(cluster_name, index_name) {
        // api/indices/[cluster_name]/[index_name]
        return this.que.add({
            url: 'api/indices/' + cluster_name + '/' + index_name + '/_stats',
            method: 'GET'
        });
    }

    clusterIndiceMappings(cluster_name, index_name) {
        // api/indices/[cluster_name]/[index_name]
        return this.que.add({
            url: 'api/indices/' + cluster_name + '/' + index_name + '/_mapping',
            method: 'GET'
        });
    }

    clusterIndiceShards(cluster_name, index_name) {
        // api/indices/[cluster_name]/[index_name]
        return this.que.add({
            url: 'api/indices/' + cluster_name + '/' + index_name + '/_shards',
            method: 'GET'
        });
    }

    clusterIndiceAliases(cluster_name, index_name, alias_name) {
        // api/indices/[cluster_name]/[index_name]/[alias_name]
        return this.que.add({
            url: 'api/indices/' + cluster_name + '/' + index_name + '/_aliases',
            method: 'GET'
        });
    }


    clusterIndicesOpen(cluster_name, index_name) {
        return this.que.add({
            url: 'api/indices/' + cluster_name + '/' + index_name + '/action/_open',
            method: 'PUT'
        });
    }
    clusterIndicesClose(cluster_name, index_name) {
        return this.que.add({
            url: 'api/indices/' + cluster_name + '/' + index_name + '/action/_close',
            method: 'PUT'
        });
    }

    clusterIndicesClearCache(cluster_name, index_name) {
        if (index_name === undefined) {
            return this.que.add({
                url: 'api/indices/' + cluster_name + '/action/_cache',
                method: 'PUT'
            });
        }
        else {
            return this.que.add({
                url: 'api/indices/' + cluster_name + '/' + index_name + '/action/_cache',
                method: 'PUT'
            });
        }
    }

    clusterIndicesRefresh(cluster_name, index_name) {
        if (index_name === undefined) {
            return this.que.add({
                url: 'api/indices/' + cluster_name + '/action/_refresh',
                method: 'PUT'
            });
        }
        else {
            return this.que.add({
                url: 'api/indices/' + cluster_name + '/' + index_name + '/action/_refresh',
                method: 'PUT'
            });
        }
    }

    clusterIndicesFlush(cluster_name, index_name) {
        if (index_name === undefined) {
            return this.que.add({
                url: 'api/indices/' + cluster_name + '/action/_flush',
                method: 'PUT'
            });
        }
        else {
            return this.que.add({
                url: 'api/indices/' + cluster_name + '/' + index_name + '/action/_flush',
                method: 'PUT'
            });
        }
    }

    clusterIndicesForceMerge(cluster_name, index_name) {
        if (index_name === undefined) {
            return this.que.add({
                url: 'api/indices/' + cluster_name + '/action/_force_merge',
                method: 'PUT'
            });
        }
        else {
            return this.que.add({
                url: 'api/indices/' + cluster_name + '/' + index_name + '/action/_force_merge',
                method: 'PUT'
            });
        }
    }

    clusterIndicesExpungeDeleted(cluster_name, index_name) {
        if (index_name === undefined) {
            return this.que.add({
                url: 'api/indices/' + cluster_name + '/action/_expunge_deleted',
                method: 'PUT'
            });
        }
        else {
            return this.que.add({
                url: 'api/indices/' + cluster_name + '/' + index_name + '/action/_expunge_deleted',
                method: 'PUT'
            });
        }
    }

    queryCluster(cluster_name, index_name, query_json) {
        return this.que.add({
            url: `api/query/${cluster_name}/${index_name}`,
            method: 'POST',
            data: {query: query_json}
        })
    }

}

export default ClusterIndicesService;
