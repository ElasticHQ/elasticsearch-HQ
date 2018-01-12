import ClusterConnection from './cluster-connection/cluster-connection.service';

const CommonServices = angular.module('common', [])
                                    .service('ClusterConnection', ClusterConnection)
                                    .name;

export default CommonServices;