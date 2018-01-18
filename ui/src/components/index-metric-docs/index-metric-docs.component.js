import template from './index-metric-docs.template.html';
import controller from './index-metric-docs.controller';

const indexMetricDocsComponent = {
  bindings: {
    stats: '<',
    summary: '<'
  },
  template,
  controller,
  controllerAs: 'iMDocsCtrl'
};

export default indexMetricDocsComponent;
