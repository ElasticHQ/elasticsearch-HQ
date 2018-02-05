import angular from 'angular';
import nodeDiagnosticsWrapper from './node-diagnostics-wrapper.component';

export default angular.module('eshq.nodeDiagnosticsWrapper', [])
  .component('eshqNodeDiagnosticsWrapper', nodeDiagnosticsWrapper)
  .name;
