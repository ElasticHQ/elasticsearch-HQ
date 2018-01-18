import angular from 'angular';

import homeController from './home/home.controller';

// Cluster('s) Views
import clusterDetailsController from './cluster-details/cluster-details.controller';
import clusterIndicesController from './cluster-indices/cluster-indices.controller';


const CommonContainers = angular.module('commonContainers', [])
                            .controller('homeController', homeController)
                            .controller('clusterDetailsController', clusterDetailsController)
                            .controller('clusterIndicesController', clusterIndicesController)
                            .name;

export default CommonContainers;