import './cluster-indice-details.style.scss';

import _ from 'lodash';
import numaral from 'numeral';

class clusterIndiceDetailsController {

  // Imports go here
  constructor($stateParams, ClusterIndices) {
    'ngInject';
    
    this.clusterName = $stateParams.clusterName;
    this.indexName = $stateParams.indexName;

    this.ClusterIndices = ClusterIndices;

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
    this.fetching = true;
    this.fetchingTitle = 'Aliases';
    this.aliases= undefined;
    this.ClusterIndices.clusterIndiceAliases(this.clusterName, this.indexName).then((resp) => {
      this.aliases = _.orderBy(resp.data.data, 'alias');
    }).finally(() => this.fetching = false)
  }

  setRows() {
    if (!this.summary || !this.stats) return;
    this.fetching = false
    const formatNum = '0[.][0][0] a';
    const formatByt = '0[.][0][0] b';

    let { settings } = this.summary;
    let { primaries, total } = this.stats;
    let row = [];

    row.push({ label: 'Documents', value: numaral(primaries.docs.count).format(formatNum) });
    row.push({ label: 'Primary Size', value: numaral(primaries.store.size_in_bytes).format(formatByt) });
    row.push({ label: 'Total Size', value: numaral(total.store.size_in_bytes).format(formatByt) });
    row.push({ label: 'Shards', value: numaral(this.summary.settings.number_of_shards).format(formatNum) + " : " +  numaral(this.summary.settings.number_of_replicas).format(formatNum) });
    this.firstRow = row
  }

  
  
}

export default clusterIndiceDetailsController;
