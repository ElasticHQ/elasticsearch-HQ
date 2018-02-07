import './cluster-details.style.scss';

import _ from 'lodash';
import numeral from 'numeral';

class clusterDetailsController {

  // Imports go here
  constructor($stateParams, ClusterIndices, ClusterNodes) {
    'ngInject';
    
    this.clusterName = $stateParams.clusterName

    this.ClusterIndices = ClusterIndices;
    this.ClusterNodes = ClusterNodes;

    this.fetchingIndices = true;
    this.ClusterIndices.clusterInidices(this.clusterName).then((resp) => {
      console.log('------ inidicies: ', resp.data.data)
      this.indices = resp.data.data;

    })
    .catch((err) => {
      console.log('---- err: ', err)
    })
    .finally(() => {
      this.fetchingIndices = false;
    });

    this.ClusterNodes.getNodesSummary(this.clusterName).then((resp) => {
      console.log('---- new nodes summary: ', resp.data.data)
      let data = resp.data.data;
      this.nodes = data.map((node) => {
        // let { fs } = node;
        // node.jvm.used_percent = node.jvm.heap_used_percent / 100;
        // let used = fs.total_in_bytes - fs.available_in_bytes;
        // fs.used_in_percent = (used / fs.total_in_bytes); /// 100;
        return node;
      })
    })

    /*
    /api/indices/[cluster_name]/_summary"
     - Number of nodes
      - Number of Shardes
    /api/indices/[cluster_name]
     - List Indices
    */
  }
  

}

export default clusterDetailsController;
