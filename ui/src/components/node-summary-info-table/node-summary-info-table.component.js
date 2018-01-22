import template from './node-summary-info-table.template.html';
import controller from './node-summary-info-table.controller';

const nodeSummaryInfoTableComponent = {
  bindings: {
    info: '<'
  },
  template,
  controller,
  controllerAs: 'nodeSummaryInfoTableCtrl'
};

export default nodeSummaryInfoTableComponent;
