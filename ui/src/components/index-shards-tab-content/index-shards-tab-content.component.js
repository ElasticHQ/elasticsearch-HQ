import template from './index-shards-tab-content.template.html';
import controller from './index-shards-tab-content.controller';

const indexShardsTabContentComponent = {
  bindings: {
    shards: '<'
  },
  template,
  controller,
  controllerAs: 'iSTabContentCtrl'
};

export default indexShardsTabContentComponent;
