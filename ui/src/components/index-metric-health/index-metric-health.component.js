import template from './index-metric-health.template.html';
import controller from './index-metric-health.controller';

const indexMetricHealthComponent = {
  bindings: {
    stats: '<'
  },
  template,
  controller,
  controllerAs: 'indexMetricHealthCtrl'
};

export default indexMetricHealthComponent;
