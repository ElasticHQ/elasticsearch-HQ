import template from './index-metrics-tab-content.template.html';
import controller from './index-metrics-tab-content.controller';

const indexMetricsTabContentComponent = {
  bindings: {
    primaries: '<',
    stats: '<'
  },
  template,
  controller,
  controllerAs: 'indexMetricsTabContentCtrl'
};

export default indexMetricsTabContentComponent;
