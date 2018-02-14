import angular from 'angular';
import nodeJvmStatsTable from './node-jvm-stats-table.component';

export default angular.module('eshq.nodeJvmStatsTable', [])
  .component('eshqNodeJvmStatsTable', nodeJvmStatsTable)
  .name;
