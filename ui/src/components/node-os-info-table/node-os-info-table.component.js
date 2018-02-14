import template from './node-os-info-table.template.html';
import controller from './node-os-info-table.controller';

const nodeOsInfoTableComponent = {
  bindings: {
    os: '<',
    stats: '<'
  },  
  template,
  controller,
  controllerAs: 'nodeOsInfoTableCtrl'
};

export default nodeOsInfoTableComponent;
