import angular from 'angular';
import clusterNodesLineGraph from './cluster-nodes-line-graph.component';

export default angular.module('eshq.clusterNodesLineGraph', [])
  .component('eshqClusterNodesLineGraph', clusterNodesLineGraph)
  .name;
