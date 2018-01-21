import template from './index-aliases-tab-content.template.html';
import controller from './index-aliases-tab-content.controller';

const indexAliasesTabContentComponent = {
  bindings: {
    aliases: '<'
  },  
  template,
  controller,
  controllerAs: 'iSTabContentCtrl'
};

export default indexAliasesTabContentComponent;
