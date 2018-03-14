import angular from 'angular';
import repositoriesTable from './repositories-table.component';

export default angular.module('eshq.repositoriesTable', [])
  .component('eshqRepositoriesTable', repositoriesTable)
  .name;
