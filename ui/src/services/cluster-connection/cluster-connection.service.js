class ClusterConnectionService {

  // Imports go here
  constructor(QueuedFactory) {
    'ngInject';
    
    this.que = QueuedFactory;
  }

  // Example request
  connectCluster(data) {
    return this.que.add({
              url: ('/api/clusters/_connect'),
              method: 'POST',
              data: data
            });
  }

  getClusters() {
    return this.que.add({
              url: ('/api/clusters'),
              method: 'GET'
            });
  }


  deleteCluster(cluster_name) {
    return this.que.add({
              url: ('/api/clusters/' + cluster_name) + '/_connect',
              method: 'DELETE'
            });
  }

  summary(cluster_name) {
    return this.que.add({
      url: ('/api/clusters/' + cluster_name + '/_summary'),
      method: 'GET'
    });
  }


  
}

export default ClusterConnectionService;
