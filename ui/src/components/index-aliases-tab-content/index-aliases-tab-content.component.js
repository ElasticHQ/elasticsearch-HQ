import template from './index-aliases-tab-content.template.html';
import controller from './index-aliases-tab-content.controller';

const indexAliasesTabContentComponent = {
  bindings: {
    aliases: '<',
    fetch: '&'
  },  
  template,
  controller,
  controllerAs: 'iATabContentCtrl'
};

export default indexAliasesTabContentComponent;
