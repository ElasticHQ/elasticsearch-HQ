import angular from 'angular';

import homeController from './home/home.controller';
import settingsController from './settings/settings.controller';


// Cluster('s) Views
import clusterDetailsController from './cluster-details/cluster-details.controller';
import clusterIndicesController from './cluster-indices/cluster-indices.controller';
import clusterIndiceDetailsController from './cluster-indice-details/cluster-indice-details.controller';
import clusterIndexQueryController from './cluster-index-query/cluster-index-query.controller';
import clusterNodeDetailsController from './cluster-node-details/cluster-node-details.controller';
import clusterNodesController from './cluster-nodes/cluster-nodes.controller';
import clusterSnapshotsController from './cluster-snapshots/cluster-snapshots.controller';
import clusterAliasesController from "./cluster-aliases/cluster-aliases.controller";
import diagnosticsController from './diagnostics/diagnostics.controller'
import restApiController from'./rest-api/rest-api.controller';
import clusterSnapshotsDetailsController from "./cluster-snapshots-details/cluster-snapshots-details.controller";
import clusterIndicesClosedController from "./cluster-indices-closed/cluster-indices-closed.controller";
import clusterIndicesDeletedController from "./cluster-indices-deleted/cluster-indices-deleted.controller";

const CommonContainers = angular.module('commonContainers', [])
                            .controller('homeController', homeController)
                            .controller('clusterDetailsController', clusterDetailsController)
                            .controller('clusterIndicesController', clusterIndicesController)
                            .controller('clusterIndexQueryController', clusterIndexQueryController)
                            .controller('clusterAliasesController', clusterAliasesController)
                            .controller('clusterIndicesClosedController', clusterIndicesClosedController)
                            .controller('clusterIndicesDeletedController', clusterIndicesDeletedController)
                            .controller('clusterIndiceDetailsController', clusterIndiceDetailsController)
                            .controller('clusterNodeDetailsController', clusterNodeDetailsController)
                            .controller('clusterNodesController', clusterNodesController)
                            .controller('clusterSnapshotsController', clusterSnapshotsController)
                            .controller('clusterSnapshotsDetailsController', clusterSnapshotsDetailsController)
                            .controller('diagnosticsController', diagnosticsController)
                            .controller('settingsController', settingsController)
                            .controller('restApiController', restApiController)
                            .name;

export default CommonContainers;