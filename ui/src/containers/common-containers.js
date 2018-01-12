import angular from 'angular';

import homeController from './home/home.controller';
import clusterDetailsController from './cluster-details/cluster-details.controller';

const CommonContainers = angular.module('commonContainers', [])
                            .controller('homeController', homeController)
                            .controller('clusterDetailsController', clusterDetailsController)
                            .name;

export default CommonContainers;