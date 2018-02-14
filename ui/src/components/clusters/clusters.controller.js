import './clusters.style.scss';

import addClusterModal from './add-cluster-modal.html';

import _ from 'lodash';
import numeral from 'numeral';

class clustersController {
    constructor(ClusterConnection, Notification, $state, $sce, $filter, $rootScope, $uibModal) {
        'ngInject';

        this.service = ClusterConnection;

        this.Notification = Notification;
        this.$state = $state;
        this.$sce = $sce;
        this.$filter = $filter;
        this.$rootScope = $rootScope;
        this.$uibModal = $uibModal;

        this.search = { text: "" };

        const formatNum = '0[.][0][0]a';
        const formatByt = '0[.][0][0] b'; 

        this.columns = [
            {
                label: 'Cluster',
                key: 'cluster_name'
            },
            {
                label: 'Host',
                key: 'cluster_host'
            },
            {
                label: 'Active Shards',
                key: 'cluster_health.active_primary_shards',
                formatter: formatNum
            },
            {
                label: 'Total Shards',
                key: 'cluster_health.active_shards',
                formatter: formatNum
            },
            {
                label: 'Data Nodes',
                key: 'cluster_health.number_of_data_nodes',
                formatter: formatNum
            },
            {
                label: 'Total Nodes',
                key: 'cluster_health.number_of_nodes',
                formatter: formatNum
            },
        ];

        this.filterFn = this.filterFn.bind(this);
        this.$rootScope.$on('clusters.refresh', (event, data) => {
            this.getClusters();
        });

        this.getClusters();
    }

    getClusters() {
        this.service.getClusters().then((resp) => {
            this.clusters = resp.data.data;
            console.log("---- clusters: ", this.clusters)
        }, (err) => {
            this.Notification.error({message: 'Error getting clusters'});
            console.log('---- get clusters error: ', err)
        })
    }

    renderCell(obj, col){
        let val = _.get(obj, col.key);
        if (col.key === 'cluster_name') {
            let url = this.$state.href("clusterDetails", {clusterName: val})
            let str = '<a href="' + url + '">' + val + '</a>';
            return this.$sce.trustAsHtml(str);
        }
        if (!col.formatter) return this.$sce.trustAsHtml(val);
        return this.$sce.trustAsHtml(numeral(val).format(col.formatter));
    }

    deleteCluster(cluster_name){
        console.log("in delete: ", this);
        this.fetching = true;
        this.service.deleteCluster(cluster_name).then((resp) => {
            console.log('------ response: ', resp.data)
            this.Notification.success({message: `Connection deleted.`, delay: 3000});
            this.$rootScope.$emit('clusters.refresh', {})
            if (this.fetchFn && (typeof this.fetchFn === 'function')) this.fetchFn();
        }, (err) => {
            let msg = `Delete Connection Failed. ${err.status}`;
            try {
                msg += `<br /> ${err.data.message}`;
            } catch (err) { }
            this.Notification.error({message: msg, delay: 5000});
        }).finally(() => this.fetching = false)
    }

    filterFn(item) {
        let filtered = (this.search.text && this.search.text.length) ?
                          this.$filter('filter')([item], this.search.text).length :
                          1;
        return !!filtered;
    }

    addCluster() {
        const modalInstance = this.$uibModal.open({
            template: addClusterModal,
            controller: ($scope, $uibModalInstance) => {
                'ngInject';

                // After you pass in the resolver, below, attache it for reference
                $scope.disabled = false;
                $scope.$uibModalInstance = $uibModalInstance;

                $scope.formData = {};
                $scope.cancel = () => {
                    $scope.$uibModalInstance.dismiss('close');
                };

                // This is what gets returned in the end
                $scope.save = () => {
                    let data;
                    try {
                        data = this.parseURI($scope.formData.cluster_connection)
                    } catch (error) {
                        console.log('--- error: ', error.message)
                        return this.Notification.error({message: error.message, delay: 3000});
                    }
                    this.service.connectCluster(data).then((resp) => {
                        // FIXME
                        // Have to alert the Top Nav bar that a new cluster has been added
                        // Really should have much of the Cluster List in a factory.
                        this.Notification.success({message: 'Cluster successfully added', delay: 3000});
                        this.$rootScope.$emit('clusters.refresh', {});
                        $scope.$uibModalInstance.close($scope.formData);
                    }, (err) => {
            
                    })
                };

            }

        });
    }

    parseURI(connectionUri) {
        let uri = new URL(connectionUri);
        let tmp = {
            ip: uri.hostname,
            port: uri.port,
            username: uri.username,
            password: uri.password,
            use_ssl: (uri.protocol === 'https:')
        };
        return tmp
    }
}

export default clustersController;
