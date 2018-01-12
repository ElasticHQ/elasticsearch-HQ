class ClusterConnectionService {

  // Imports go here
  constructor($http) {
    'ngInject';
    
    this.$http = $http;
  }

  // Example request
  connectCluster(data) {
    return this.$http({
              url: ('http://localhost:5000/api/cluster_connect'),
              method: 'POST',
              data: data
            });
  }
}

export default ClusterConnectionService;
