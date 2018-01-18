import ClusterConnection from './cluster-connection/cluster-connection.service';
import ClusterIndices from './cluster-indices/cluster-indices.service';
import ClusterNodes from './cluster-nodes/cluster-nodes.service';

const CommonServices = angular.module('common', [])
                                    .service('ClusterConnection', ClusterConnection)
                                    .service('ClusterIndices', ClusterIndices)
                                    .service('ClusterNodes', ClusterNodes)
                                    .name;

export default CommonServices;