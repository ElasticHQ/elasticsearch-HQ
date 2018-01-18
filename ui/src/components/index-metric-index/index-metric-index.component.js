import template from './index-metric-index.template.html';
import controller from './index-metric-index.controller';

const indexMetricIndexComponent = {
  bindings: {
    stats: '<',
    summary: '<'
  },
  template,
  controller,
  controllerAs: 'indexMetricIndexCtrl'
};

export default indexMetricIndexComponent;
