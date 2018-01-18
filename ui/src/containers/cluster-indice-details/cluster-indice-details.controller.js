import './cluster-indice-details.style.scss';

import numaral from 'numeral';

class clusterIndiceDetailsController {

  // Imports go here
  constructor($stateParams, ClusterIndices) {
    'ngInject';
    
    this.clusterName = $stateParams.clusterName;
    this.indexName = $stateParams.indexName;

    // 
    ClusterIndices.clusterIndice(this.clusterName, this.indexName).then((resp) => {
      console.log("--- clusterIndice data: ", resp.data.data)
    })

    this.fetching = true;
    ClusterIndices.clusterIndiceSummary(this.clusterName, this.indexName).then((resp) => {
      console.log('----- clusterIndiceSummary: ', resp.data.data)
      this.summary = resp.data.data[0];
      this.setRows();
      
    }).finally(() => this.fetching = false)

    ClusterIndices.clusterIndiceStats(this.clusterName, this.indexName).then((resp) => {
      console.log('----- clusterIndiceStats: ', resp.data.data)

      this.stats = resp.data.data[0]._all;
      this.setRows();
    })
  }

  setRows() {
    if (!this.summary || !this.stats) return;
    const formatNum = '0[.][0][0]a';
    const formatByt = '0[.][0][0]b';

    let { settings } = this.summary;
    let { primaries, total } = this.stats;
    let row = [];

    row.push({ label: 'Documents', value: numaral(primaries.docs.count).format(formatNum) });
    row.push({ label: 'Primary Size', value: numaral(primaries.store.size_in_bytes).format(formatByt) });
    row.push({ label: 'Total Size', value: numaral(total.store.size_in_bytes).format(formatNum) });
    row.push({ label: 'Total Shards', value: numaral(this.summary.settings.number_of_shards).format(formatNum) });
    this.firstRow = row
  }
  
}

export default clusterIndiceDetailsController;
