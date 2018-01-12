import template from './cluster-summary.template.html';
import controller from './cluster-summary.controller';

const clusterSummaryComponent = {
  bindings: {
    summary: '='
  },
  template,
  controller,
  controllerAs: 'clusterSummaryCtrl'
};

export default clusterSummaryComponent;
