import template from './cluster-nodes-line-graph.template.html';
import controller from './cluster-nodes-line-graph.controller';

const clusterNodesLineGraphComponent = {
  bindings: {
    key: '<',
    data: '<',
    numFormat: '<',
    header: '<'
  },
  template,
  controller,
  controllerAs: 'cNLGraphCtrl'
};

export default clusterNodesLineGraphComponent;
