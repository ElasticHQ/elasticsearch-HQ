import angular from 'angular';
import nodeFsInfoTable from './node-fs-info-table.component';

export default angular.module('eshq.nodeFsInfoTable', [])
  .component('eshqNodeFsInfoTable', nodeFsInfoTable)
  .name;
