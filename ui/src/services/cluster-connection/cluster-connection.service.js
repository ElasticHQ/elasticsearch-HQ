class ClusterConnectionService {

  // Imports go here
  constructor($http) {
    'ngInject';
    
    this.$http = $http;
  }

  // Example request
  connectCluster(data) {
    return this.$http({
              url: ('/api/clusters/_connect'),
              method: 'POST',
              data: data
            });
  }

  getClusters() {
    return this.$http({
              url: ('/api/clusters'),
              method: 'GET'
            });
  }

  summary(cluster_name) {
    return this.$http({
      url: ('/api/clusters/' + cluster_name + '/_summary'),
      method: 'GET'
    });
  }


  
}

export default ClusterConnectionService;
