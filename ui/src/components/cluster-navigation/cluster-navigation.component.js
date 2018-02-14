import template from './cluster-navigation.template.html';
import controller from './cluster-navigation.controller';

const clusterNavigationComponent = {
  bindings: {
    summary: '=?'
  },
  template,
  controller,
  controllerAs: 'clusterNavCtrl'
};

export default clusterNavigationComponent;
