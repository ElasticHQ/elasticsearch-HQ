import template from './node-process-table.template.html';
import controller from './node-process-table.controller';

const nodeProcessTableComponent = {
  bindings: {
    process: '<',
    info: '<'
  },
  template,
  controller,
  controllerAs: 'nPTableCtrl'
};

export default nodeProcessTableComponent;
