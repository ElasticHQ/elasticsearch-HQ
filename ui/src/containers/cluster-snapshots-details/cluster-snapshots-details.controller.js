import './cluster-snapshots-details.style.scss'

class clusterSnapshotsDetailsController {
    // Imports go here
    constructor($stateParams, ClusterRepositories, Notification) {
        'ngInject';

        this.clusterName = $stateParams.clusterName;
        this.repositoryName = $stateParams.repositoryName;

        this.ClusterRepositories = ClusterRepositories;
        this.Notification = Notification;

        ClusterRepositories.clusterSnapshots(this.clusterName, this.repositoryName).then((resp) => {
            console.log("--- clustersnapshots data: ", resp.data.data);
            this.snapshots = resp.data.data;
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
            }
        ]


    }
}

export default clusterSnapshotsDetailsController;
