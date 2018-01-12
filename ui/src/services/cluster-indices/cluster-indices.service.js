class ClusterIndicesService {

  // Imports go here
  constructor($http) {
    'ngInject';
    
    this.$http = $http;
  }

  clusterInidicies(cluster_name) {
    return this.$http({
      url: '/api/indices/' + cluster_name,
      method: 'GET'
    })
  }

  // Example request
  // getExample(params) {
  //   return this.$http({
  //             url: ('/example'),
  //             method: 'GET',
  //             params: params
  //           });
  // }
}

export default ClusterIndicesService;
