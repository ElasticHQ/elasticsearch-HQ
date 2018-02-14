import angular from 'angular';
import apiEndpoints from './api-endpoints.component';

export default angular.module('eshq.apiEndpoints', [])
  .component('eshqApiEndpoints', apiEndpoints)
  .name;
