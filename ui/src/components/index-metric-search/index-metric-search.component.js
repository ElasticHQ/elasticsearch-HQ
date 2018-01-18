import template from './index-metric-search.template.html';
import controller from './index-metric-search.controller';

const indexMetricSearchComponent = {
  bindings: {
    stats: '<',
    summary: '<'
  },
  template,
  controller,
  controllerAs: 'indexMetricSearchCtrl'
};

export default indexMetricSearchComponent;
