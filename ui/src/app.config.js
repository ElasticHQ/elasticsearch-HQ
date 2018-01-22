export default ($urlRouterProvider, $stateProvider, $locationProvider) => {
    'use strict';
    'ngInject';

    $locationProvider.html5Mode(false);

    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('clusterIndices', {
            url: '/clusters/:clusterName/indices',
            template: require('./containers/cluster-indices/cluster-indices.view.html'),
            controller: 'clusterIndicesController',
            controllerAs: 'clusterIndicesCtrl'
        })
        .state('clusterAliases', {
            url: '/clusters/:clusterName/aliases',
            template: require('./containers/cluster-aliases/cluster-aliases.view.html'),
            controller: 'clusterAliasesController',
            controllerAs: 'clusterAliasesCtrl'
        })
        .state('clusterIndiceDetails', {
            url: '/clusters/:clusterName/indices/:indexName',
            template: require('./containers/cluster-indice-details/cluster-indice-details.view.html'),
            controller: 'clusterIndiceDetailsController',
            controllerAs: 'cIndDetailsCtrl'
        })
        .state('clusterNodeDetails', {
            url: '/clusters/:clusterName/nodes/:nodeId',
            template: require('./containers/cluster-node-details/cluster-node-details.view.html'),
            controller: 'clusterNodeDetailsController',
            controllerAs: 'cNodeDetailsCtrl'
        })
        .state('clusterDetails', {
            url: '/clusters/:clusterName',
            template: require('./containers/cluster-details/cluster-details.view.html'),
            controller: 'clusterDetailsController',
            controllerAs: 'clusterDetailsCtrl'
        })
        .state('home', {
            url: '/',
            template: require('./containers/home/home.view.html'),
            controller: 'homeController',
            controllerAs: 'homeCtrl'
        });
}