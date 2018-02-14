class ClusterNodesService {

  // Imports go here
  constructor(QueuedFactory) {
    'ngInject';
    
    this.que = QueuedFactory;
  }

  getNodesSummary(clusterName, nodeId) {
    return this.que.add({
              url: ('/api/nodes/' + clusterName + '/_summary'),
              method: 'GET',
            });
  }


  getNodeInfo(clusterName, nodeId) {
    return this.que.add({
              url: ('/api/nodes/' + clusterName + '/' + nodeId + '/_info'),
              method: 'GET',
            });
  }

  getNodeStats(clusterName, nodeId) {
    return this.que.add({
              url: ('/api/nodes/' + clusterName + '/' + nodeId + '/_stats'),
              method: 'GET',
            });
  }

  diagnostics(clusterName) {
    return this.que.add({
              url: ('/api/clusters/' + clusterName + '/diagnostics/_summary'),
              method: 'GET',
            });
  }
}

export default ClusterNodesService;
