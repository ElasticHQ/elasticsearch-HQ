import template from './index-metric-get.template.html';
import controller from './index-metric-get.controller';

const indexMetricGetComponent = {
  bindings: {
    stats: '<',
    summary: '<'
  },
  template,
  controller,
  controllerAs: 'indexMetricGetCtrl'
};

export default indexMetricGetComponent;
