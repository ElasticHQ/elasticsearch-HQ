import template from './index-metric-health.template.html';
import controller from './index-metric-health.controller';

const indexMetricHealthComponent = {
  bindings: {
    stats: '<',
    summary: '<'
  },
  template,
  controller,
  controllerAs: 'iMHealthCtrl'
};

export default indexMetricHealthComponent;
