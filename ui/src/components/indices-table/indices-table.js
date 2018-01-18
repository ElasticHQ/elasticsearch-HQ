import angular from 'angular';
import indicesTable from './indices-table.component';

export default angular.module('eshq.indicesTable', [])
  .component('eshqIndicesTable', indicesTable)
  .name;
