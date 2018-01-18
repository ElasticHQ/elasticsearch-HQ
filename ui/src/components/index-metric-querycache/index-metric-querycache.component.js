import template from './index-metric-querycache.template.html';
import controller from './index-metric-querycache.controller';

const indexMetricQuerycacheComponent = {
  bindings: {
    stats: '<',
    summary: '<'
  },
  template,
  controller,
  controllerAs: 'indexMetricQuerycacheCtrl'
};

export default indexMetricQuerycacheComponent;
