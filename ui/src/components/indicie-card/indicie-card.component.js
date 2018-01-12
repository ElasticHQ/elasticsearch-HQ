import template from './indicie-card.template.html';
import controller from './indicie-card.controller';

const indicieCardComponent = {
  bindings: {
    indexInfo: '='
  },
  template,
  controller,
  controllerAs: 'indicieCardCtrl'
};

export default indicieCardComponent;
