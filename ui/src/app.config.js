export default ($urlRouterProvider, $stateProvider, $locationProvider) => {
    'use strict';
    'ngInject';

    $locationProvider.html5Mode(false);

    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('home', {
            url: '/',
            template: require('./containers/home/home.view.html'),
            controller: 'homeController',
            controllerAs: 'homeCtrl'
        })
}