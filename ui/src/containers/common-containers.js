import angular from 'angular';

import homeController from './home/home.controller';
import settingsController from './settings/settings.controller';


// Cluster('s) Views
import clusterDetailsController from './cluster-details/cluster-details.controller';
import clusterIndicesController from './cluster-indices/cluster-indices.controller';
import clusterIndiceDetailsController from './cluster-indice-details/cluster-indice-details.controller';
import clusterNodeDetailsController from './cluster-node-details/cluster-node-details.controller';
import clusterAliasesController from "./cluster-aliases/cluster-aliases.controller";
import diagnosticsController from './diagnostics/diagnostics.controller'
import restApiController from'./rest-api/rest-api.controller';

const CommonContainers = angular.module('commonContainers', [])
                            .controller('homeController', homeController)
                            .controller('clusterDetailsController', clusterDetailsController)
                            .controller('clusterIndicesController', clusterIndicesController)
                            .controller('clusterAliasesController', clusterAliasesController)
                            .controller('clusterIndiceDetailsController', clusterIndiceDetailsController)
                            .controller('clusterNodeDetailsController', clusterNodeDetailsController)
                            .controller('diagnosticsController', diagnosticsController)
                            .controller('settingsController', settingsController)
                            .controller('restApiController', restApiController)
                            .name;

export default CommonContainers;