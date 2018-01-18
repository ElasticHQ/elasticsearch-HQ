import angular from 'angular';

import ClusterSummaryFactory from './cluster-summary/cluster-summary.factory';


const CommonFactories = angular.module('commonFactories', [])
                            .service('ClusterSummaryFactory', ClusterSummaryFactory)
                            .name;

export default CommonFactories;
