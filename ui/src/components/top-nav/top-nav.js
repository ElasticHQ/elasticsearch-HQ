import angular from 'angular';
import topNav from './top-nav.component';

export default angular.module('eshq.topNav', [])
  .component('eshqTopNav', topNav)
  .name;
