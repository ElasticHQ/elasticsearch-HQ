import template from './index-metric-ops.template.html';
import controller from './index-metric-ops.controller';

const indexMetricOpsComponent = {
  bindings: {
    stats: '<',
    summary: '<'
  },
  template,
  controller,
  controllerAs: 'indexMetricOpsCtrl'
};

export default indexMetricOpsComponent;
