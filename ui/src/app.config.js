export default ($urlRouterProvider, $stateProvider, $locationProvider, 
                tableSortConfigProvider, NotificationProvider) => {
    'use strict';
    'ngInject';

    $locationProvider.html5Mode(false);

    var pagerString = "<div class='custom-pagination-layout'>";
        pagerString +=      "<small class='text-muted pagination-desc'>Showing {{CURRENT_PAGE_RANGE}} {{FILTERED_COUNT === 0 ? '' : 'of'}} ";
        pagerString +=        "<span ng-if='FILTERED_COUNT === TOTAL_COUNT'>{{TOTAL_COUNT | number}} {{TOTAL_COUNT === 1 ? ITEM_NAME_SINGULAR : ITEM_NAME_PLURAL}}</span>";
        pagerString +=        "<span ng-if='FILTERED_COUNT !== TOTAL_COUNT'>{{FILTERED_COUNT | number}} {{FILTERED_COUNT === 1 ? ITEM_NAME_SINGULAR : ITEM_NAME_PLURAL}} (filtered from {{TOTAL_COUNT | number}})</span>";
        pagerString +=      "</small>&nbsp;";
        pagerString +=      "<ul uib-pagination style='vertical-align:middle;' ng-if='ITEMS_PER_PAGE < TOTAL_COUNT' ng-model='CURRENT_PAGE_NUMBER' ";
        pagerString +=        "total-items='FILTERED_COUNT' items-per-page='ITEMS_PER_PAGE' max-size='5' force-ellipses='true'></ul>&nbsp;";
        pagerString +=      "<div class='form-group' style='display:inline-block;'>";
        pagerString +=        "<select class='form-control' ng-model='ITEMS_PER_PAGE' ng-options='opt as (opt + \" per page\") for opt in PER_PAGE_OPTIONS'></select>";
        pagerString +=      "</div>";
        pagerString +=    "</div>";
        tableSortConfigProvider.paginationTemplate = pagerString;

    NotificationProvider.setOptions({
            delay: 10000,
            startTop: 60,
            startRight: 10,
            verticalSpacing: 20,
            horizontalSpacing: 20,
            positionX: 'right',
            positionY: 'top'
        });

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
        .state('diagnostics', {
            url: '/clusters/:clusterName/diagnostics',
            template: require('./containers/diagnostics/diagnostics.view.html'),
            controller: 'diagnosticsController',
            controllerAs: 'diagnosticsCtrl'
        })
        .state('clusterDetails', {
            url: '/clusters/:clusterName',
            template: require('./containers/cluster-details/cluster-details.view.html'),
            controller: 'clusterDetailsController',
            controllerAs: 'clusterDetailsCtrl'
        })
        .state('settings', {
            url: '/settings',
            abstract: true,
            template: require('./containers/settings/settings.view.html'),
            controller: 'settingsController',
            controllerAs: 'settingsCtrl'
        })
        .state('settings.clusters', {
            url: '/clusters',
            component: 'eshqClusters'
        })
        .state('restapi', {
            url: '/clusters/:clusterName/restapi',
            abstract: true,
            controller: 'restApiController',
            controllerAs: 'restApiCtrl',
            template: require('./containers/rest-api/rest-api.view.html')
        })
        .state('restapi.endpoints', {
            url: '/endpoints',
            component: 'eshqApiEndpoints'
        })
        .state('home', {
            url: '/',
            template: require('./containers/home/home.view.html'),
            controller: 'homeController',
            controllerAs: 'homeCtrl'
        });
}