import template from './indices-table.template.html';
import controller from './indices-table.controller';

const indicesTableComponent = {
  bindings: {
    indices: '='
  },
  template,
  controller,
  controllerAs: 'indicesTableCtrl'
};

export default indicesTableComponent;
