class ClusterNodesService {

  // Imports go here
  constructor($http) {
    'ngInject';
    
    this.$http = $http;
  }

  getNodesSummary(clusterName, nodeId) {
    return this.$http({
              url: ('/api/nodes/' + clusterName + '/_summary'),
              method: 'GET',
            });
  }


  getNodeInfo(clusterName, nodeId) {
    return this.$http({
              url: ('/api/nodes/' + clusterName + '/' + nodeId + '/_info'),
              method: 'GET',
            });
  }

  getNodeStats(clusterName, nodeId) {
    return this.$http({
              url: ('/api/nodes/' + clusterName + '/' + nodeId + '/_stats'),
              method: 'GET',
            });
  }
}

export default ClusterNodesService;
