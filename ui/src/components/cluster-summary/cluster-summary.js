import angular from 'angular';
import clusterSummary from './cluster-summary.component';

export default angular.module('eshq.clusterSummary', [])
  .component('eshqClusterSummary', clusterSummary)
  .name;
