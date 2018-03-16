import './cluster-snapshots-details.style.scss';
import viewSnapshotModal from './cluster-snapshots-details-modal.html';
import moment from 'moment';

class clusterSnapshotsDetailsController {
    // Imports go here
    constructor($stateParams, ClusterRepositories, $scope,
                Notification, $uibModal) {
        'ngInject';

        this.clusterName = $stateParams.clusterName;
        this.repositoryName = $stateParams.repositoryName;
        this.$uibModal = $uibModal;
        this.ClusterRepositories = ClusterRepositories;
        this.Notification = Notification;

        ClusterRepositories.clusterSnapshots(this.clusterName, this.repositoryName).then((resp) => {
            console.log("--- clustersnapshots data: ", resp.data.data);
            this.snapshots = resp.data.data.map((itm) => {
                itm.duration_in_words = moment.duration(itm.duration_in_millis).humanize();
                itm.index_count = itm.indices.length;
                return itm
            })
        });

        // Pagination stuff
        this.totalItems = 1;
        this.currentPage = 1;
        this.maxSize = 7;
        this.itemsPerPage = 10;

        this.search = {text: ''};

        this.columns = [
            {
                label: 'State',
                key: 'state'
            },
            {
                label: 'Snapshot',
                key: 'snapshot'
            },
            {
                label: 'Start Time',
                key: 'start_time_in_millis'
            },
            {
                label: 'End Time',
                key: 'end_time_in_millis'
            },
            {
                label: 'Duration',
                key: 'duration_in_millis'
            },
            {
                label: 'Indices',
                key: 'indices'
            },
            {
                label: 'Shards',
                key: 'shards'
            }
        ];
    }

    viewSnapshot(data) {
        console.log(data);
        const modalInstance = this.$uibModal.open({
            template: viewSnapshotModal,
            controller: ($scope, $uibModalInstance, clusterName) => {
                'ngInject';

                // After you pass in the resolver, below, attache it for reference
                $scope.clusterName = clusterName;
                $scope.snapshot = data;
                $scope.indices = data.indices.map((d,i) => {return {name: d, id: i}});
                $scope.disabled = false;
                $scope.$uibModalInstance = $uibModalInstance;

                $scope.cancel = () => {
                    $scope.$uibModalInstance.dismiss('close');
                };
            },
            resolve: {
                // How you pass info into the Modal
                clusterName: () => {
                    return this.clusterName;
                },
            }

        });
    }
}

export default clusterSnapshotsDetailsController;
