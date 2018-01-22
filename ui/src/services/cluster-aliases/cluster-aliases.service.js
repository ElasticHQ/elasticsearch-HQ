class ClusterAliasesService {

    // Imports go here
    constructor($http) {
        'ngInject';
        this.$http = $http;
    }

    clusterAliases(cluster_name) {
        return this.$http({
            url: '/api/indices/' + cluster_name + '/_aliases',
            method: 'GET'
        });
    }

}

export default ClusterAliasesService;
