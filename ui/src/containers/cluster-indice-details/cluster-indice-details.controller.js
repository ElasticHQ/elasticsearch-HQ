import './cluster-indice-details.style.scss'

class clusterIndiceDetailsController {

  // Imports go here
  constructor($stateParams, ClusterIndices) {
    'ngInject';
    
    this.clusterName = $stateParams.clusterName;
    this.indexName = $stateParams.indexName
    // 
    ClusterIndices.clusterIndice(this.clusterName, this.indexName).then((resp) => {
      console.log("--- data: ", resp.data.data)
    })

    ClusterIndices.clusterIndiceSummary(this.clusterName, this.indexName).then((resp) => {
      console.log('----- summary: ', resp.data.data)
    })

    ClusterIndices.clusterIndiceStats(this.clusterName, this.indexName).then((resp) => {
      console.log('----- stats: ', resp.data.data)
    })
  }
}

export default clusterIndiceDetailsController;
