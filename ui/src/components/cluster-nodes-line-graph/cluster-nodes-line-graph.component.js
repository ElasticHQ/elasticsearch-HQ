import template from './cluster-nodes-line-graph.template.html';
import controller from './cluster-nodes-line-graph.controller';

const clusterNodesLineGraphComponent = {
  bindings: {
    key: '<',
    data: '<',
    numFormat: '<',
    header: '<',
    allowRendering: '<'
  },
  template,
  controller,
  controllerAs: 'cNLGraphCtrl'
};

export default clusterNodesLineGraphComponent;
