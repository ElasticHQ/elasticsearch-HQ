import angular from 'angular';

import homeController from './home/home.controller';

// Cluster('s) Views
import clusterDetailsController from './cluster-details/cluster-details.controller';
import clusterIndicesController from './cluster-indices/cluster-indices.controller';
import clusterIndiceDetailsController from './cluster-indice-details/cluster-indice-details.controller';
import clusterNodeDetailsController from './cluster-node-details/cluster-node-details.controller';
import clusterAliasesController from "./cluster-aliases/cluster-aliases.controller";


const CommonContainers = angular.module('commonContainers', [])
                            .controller('homeController', homeController)
                            .controller('clusterDetailsController', clusterDetailsController)
                            .controller('clusterIndicesController', clusterIndicesController)
                            .controller('clusterAliasesController', clusterAliasesController)
                            .controller('clusterIndiceDetailsController', clusterIndiceDetailsController)
                            .controller('clusterNodeDetailsController', clusterNodeDetailsController)
                            .name;

export default CommonContainers;