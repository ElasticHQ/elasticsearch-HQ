import template from './index-metric-docs.template.html';
import controller from './index-metric-docs.controller';

const indexMetricDocsComponent = {
  bindings: {
    stats: '<'
  },
  template,
  controller,
  controllerAs: 'indexMetricDocsCtrl'
};

export default indexMetricDocsComponent;
