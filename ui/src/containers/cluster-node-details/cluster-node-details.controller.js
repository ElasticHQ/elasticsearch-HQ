import './cluster-node-details.style.scss'

class clusterNodeDetailsController {

  // Imports go here
  constructor($stateParams, ClusterNodes) {
    'ngInject';
    
    this.clusterName = $stateParams.clusterName;
    this.nodeId = $stateParams.nodeId;
    this.service = ClusterNodes;

    this.service.getNodeInfo(this.clusterName, this.nodeId).then((resp) => {
      console.log('--- node info: ', resp.data.data)
      this.info = resp.data.data[0].nodes[this.nodeId];
    })

    this.service.getNodeStats(this.clusterName, this.nodeId).then((resp) => {
      console.log('--- node stats: ', resp.data.data)
      this.stats = resp.data.data[0].nodes[this.nodeId];
    })
  }
}

export default clusterNodeDetailsController;
