import angular from 'angular';

import ClusterSummaryFactory from './cluster-summary/cluster-summary.factory';
import QueuedFactory from './queued/queued.factory';


const CommonFactories = angular.module('commonFactories', [])
                            .service('ClusterSummaryFactory', ClusterSummaryFactory)
                            .service('QueuedFactory', QueuedFactory)
                            .name;

export default CommonFactories;
