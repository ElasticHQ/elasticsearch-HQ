import ClusterConnection from './cluster-connection/cluster-connection.service';
import ClusterIndices from './cluster-indices/cluster-indices.service';

const CommonServices = angular.module('common', [])
                                    .service('ClusterConnection', ClusterConnection)
                                    .service('ClusterIndices', ClusterIndices)
                                    .name;

export default CommonServices;