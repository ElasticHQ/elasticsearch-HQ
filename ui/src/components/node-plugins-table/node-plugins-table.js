import angular from 'angular';
import nodePluginsTable from './node-plugins-table.component';

export default angular.module('eshq.nodePluginsTable', [])
  .component('eshqNodePluginsTable', nodePluginsTable)
  .name;
