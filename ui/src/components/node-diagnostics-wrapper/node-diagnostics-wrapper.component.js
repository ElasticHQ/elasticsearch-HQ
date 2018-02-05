import template from './node-diagnostics-wrapper.template.html';
import controller from './node-diagnostics-wrapper.controller';

const nodeDiagnosticsWrapperComponent = {
  bindings: {
    nodeInfo: '<'
  },
  template,
  controller,
  controllerAs: 'nDWrapperCtrl'
};

export default nodeDiagnosticsWrapperComponent;
