import ClusterConnection from './cluster-connection/cluster-connection.service';
import ClusterIndices from './cluster-indices/cluster-indices.service';
import ClusterNodes from './cluster-nodes/cluster-nodes.service';
import ClusterAliases from './cluster-aliases/cluster-aliases.service';

const CommonServices = angular.module('common', [])
                                    .service('ClusterConnection', ClusterConnection)
                                    .service('ClusterIndices', ClusterIndices)
                                    .service('ClusterAliases', ClusterAliases)
                                    .service('ClusterNodes', ClusterNodes)
                                    .name;

export default CommonServices;