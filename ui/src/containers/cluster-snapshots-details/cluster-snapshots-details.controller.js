import './cluster-snapshots-details.style.scss';

import moment from 'moment';

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
            this.snapshots = resp.data.data.map((itm) => {
                itm.duration_in_words =  moment.duration(itm.duration_in_millis).humanize()
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
            }
        ]


    }
}

export default clusterSnapshotsDetailsController;
