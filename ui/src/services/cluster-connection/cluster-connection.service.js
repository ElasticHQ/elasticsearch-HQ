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
}

export default ClusterConnectionService;
