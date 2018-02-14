import template from './node-fs-info-table.template.html';
import controller from './node-fs-info-table.controller';

const nodeFsInfoTableComponent = {
  bindings: {
    fs: '<'
  },
  template,
  controller,
  controllerAs: 'nFITableCtrl'
};

export default nodeFsInfoTableComponent;
