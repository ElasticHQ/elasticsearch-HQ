import template from './index-metrics-tab-content.template.html';
import controller from './index-metrics-tab-content.controller';

const indexMetricsTabContentComponent = {
  bindings: {
    summary: '<',
    stats: '<'
  },
  template,
  controller,
  controllerAs: 'iMTabContentCtrl'
};

export default indexMetricsTabContentComponent;
