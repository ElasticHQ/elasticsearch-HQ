import template from './index-mappings-tab-content.template.html';
import controller from './index-mappings-tab-content.controller';

const indexMappingsTabContentComponent = {
  bindings: {
    mappings: '<'
  },
  template,
  controller,
  controllerAs: 'iMTContentCtrl'
};

export default indexMappingsTabContentComponent;
