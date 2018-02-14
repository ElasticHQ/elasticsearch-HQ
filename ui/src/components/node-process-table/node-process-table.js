import angular from 'angular';
import nodeProcessTable from './node-process-table.component';

export default angular.module('eshq.nodeProcessTable', [])
  .component('eshqNodeProcessTable', nodeProcessTable)
  .name;
