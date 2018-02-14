import angular from 'angular';
import clusters from './clusters.component';

export default angular.module('eshq.clusters', [])
  .component('eshqClusters', clusters)
  .name;
