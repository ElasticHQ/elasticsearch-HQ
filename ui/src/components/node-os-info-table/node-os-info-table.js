import angular from 'angular';
import nodeOsInfoTable from './node-os-info-table.component';

export default angular.module('eshq.nodeOsInfoTable', [])
  .component('eshqNodeOsInfoTable', nodeOsInfoTable)
  .name;
