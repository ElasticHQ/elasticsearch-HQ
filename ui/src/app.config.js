export default ($urlRouterProvider, $stateProvider, $locationProvider) => {
    'use strict';
    'ngInject';

    $locationProvider.html5Mode(false);

    $urlRouterProvider.otherwise('/');

    $stateProvider
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