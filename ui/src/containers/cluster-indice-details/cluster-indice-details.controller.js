import './cluster-indice-details.style.scss';

import _ from 'lodash';
import numaral from 'numeral';

class clusterIndiceDetailsController {

    // Imports go here
    constructor($stateParams, ClusterIndices, Notification) {
        'ngInject';

        this.clusterName = $stateParams.clusterName;
        this.indexName = $stateParams.indexName;

        this.ClusterIndices = ClusterIndices;
        this.Notification = Notification;
        // Default to this
        //  In the future, monitor which tab is open so we can
        //  hot link into a tab
        this.fetchMetrics();

        //
        ClusterIndices.clusterIndice(this.clusterName, this.indexName).then((resp) => {
            console.log("--- clusterIndice data: ", resp.data.data)
        })


    }

    fetchMetrics() {
        // we turn fetching off when both calls are done
        this.fetching = true;
        this.fetchingTitle = 'Index information';
        // Reset info
        this.summary = this.stats = undefined;
        this.ClusterIndices.clusterIndiceSummary(this.clusterName, this.indexName).then((resp) => {
            this.summary = resp.data.data[0];
            this.setRows();

        })

        this.ClusterIndices.clusterIndiceStats(this.clusterName, this.indexName).then((resp) => {
            this.stats = resp.data.data[0]._all;
            this.setRows();
        })

    }

    fetchShards() {
        this.fetching = true;
        this.fetchingTitle = 'Shards';
        this.shards = undefined;
        this.ClusterIndices.clusterIndiceShards(this.clusterName, this.indexName).then((resp) => {
            this.shards = _.orderBy(resp.data.data, 'shard');
        }).finally(() => this.fetching = false)
    }

    fetchAliases() {
        console.log("Fetching Aliases");
        this.fetching = true;
        this.fetchingTitle = 'Aliases';
        this.aliases = undefined;
        this.ClusterIndices.clusterIndiceAliases(this.clusterName, this.indexName).then((resp) => {
            this.aliases = _.orderBy(resp.data.data, 'alias');
        }).finally(() => this.fetching = false)
    }

    setRows() {
        if (!this.summary || !this.stats) return;
        this.fetching = false
        const formatNum = '0[.][0][0] a';
        const formatByt = '0[.][0][0] b';

        let {settings} = this.summary;
        let {primaries, total} = this.stats;
        let row = [];

        row.push({label: 'Documents', value: numaral(primaries.docs.count).format(formatNum)});
        row.push({label: 'Primary Size', value: numaral(primaries.store.size_in_bytes).format(formatByt)});
        row.push({label: 'Total Size', value: numaral(total.store.size_in_bytes).format(formatByt)});
        row.push({
            label: 'Shards',
            value: numaral(this.summary.settings.number_of_shards).format(formatNum) + " : " + numaral(this.summary.settings.number_of_replicas).format(formatNum)
        });
        this.firstRow = row
    }

    fetchMapping() {
        this.fetching = true;
        this.fetchingTitle = 'Mappings';
        this.mappings = undefined;

        this.ClusterIndices.clusterIndiceMappings(this.clusterName, this.indexName).then((resp) => {
            this.mappings = resp.data.data[0];
        }).finally(() => this.fetching = false)
    }

    flushCache() {
        this.ClusterIndices.clusterIndicesFlush(this.clusterName, this.indexName).then((resp) => {
            this.Notification.success({message: `Cache flush operation triggered.`, delay: 3000});
        }, (err) => {
            this.Notification.error({message: 'Error in operation!'});
            console.log('---- get clusters error: ', err)
        })
    }
    clearCache() {
        this.ClusterIndices.clusterIndicesClearCache(this.clusterName, this.indexName).then((resp) => {
            this.Notification.success({message: `Cache clear operation triggered.`, delay: 3000});
        }, (err) => {
            this.Notification.error({message: 'Error in operation!'});
            console.log('---- get clusters error: ', err)
        })
    }
    refreshIndex() {
        this.ClusterIndices.clusterIndicesRefresh(this.clusterName, this.indexName).then((resp) => {
            this.Notification.success({message: `Index refresh operation triggered.`, delay: 3000});
        }, (err) => {
            this.Notification.error({message: 'Error in operation!'});
            console.log('---- get clusters error: ', err)
        })
    }
    forceMergeIndex() {
        this.ClusterIndices.clusterIndicesForceMerge(this.clusterName, this.indexName).then((resp) => {
            this.Notification.success({message: `Segment merging operation triggered.`, delay: 3000});
        }, (err) => {
            this.Notification.error({message: 'Error in operation!'});
            console.log('---- get clusters error: ', err)
        })
    }
    expungeDeleted() {
        this.ClusterIndices.clusterIndicesExpungeDeleted(this.clusterName, this.indexName).then((resp) => {
            this.Notification.success({message: `Expunge deleted operation triggered.`, delay: 3000});
        }, (err) => {
            this.Notification.error({message: 'Error in operation!'});
            console.log('---- get clusters error: ', err)
        })
    }
}

export default clusterIndiceDetailsController;
