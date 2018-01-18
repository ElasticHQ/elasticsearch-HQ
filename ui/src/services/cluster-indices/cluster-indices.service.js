class ClusterIndicesService {

  // Imports go here
  constructor($http) {
    'ngInject';
    
    this.$http = $http;
  }

  clusterInidices(cluster_name) {
    return this.$http({
      url: '/api/indices/' + cluster_name + '/_summary',
      method: 'GET'
    });
  }

  clusterIndice(cluster_name, index_name) {
    // /api/indices/[cluster_name]/[index_name]
    return this.$http({
      url: '/api/indices/' + cluster_name + '/' + index_name,
      method: 'GET'
    });
  }

  clusterIndiceSummary(cluster_name, index_name) {
    // /api/indices/[cluster_name]/[index_name]
    return this.$http({
      url: '/api/indices/' + cluster_name + '/' + index_name + '/_summary',
      method: 'GET'
    });
  }

  clusterIndiceStats(cluster_name, index_name) {
    // /api/indices/[cluster_name]/[index_name]
    return this.$http({
      url: '/api/indices/' + cluster_name + '/' + index_name + '/_stats',
      method: 'GET'
    });
  }

  clusterIndiceShards(cluster_name, index_name) {
    // /api/indices/[cluster_name]/[index_name]
    return this.$http({
      url: '/api/indices/' + cluster_name + '/' + index_name + '/_shards',
      method: 'GET'
    });
  }

}

export default ClusterIndicesService;
