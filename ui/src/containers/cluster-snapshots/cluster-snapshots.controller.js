import './cluster-snapshots.style.scss'

class clusterSnapshotsController {

    constructor($stateParams, ClusterRepositories, QueuedFactory, $scope,
                Notification, $uibModal) {
        'ngInject';

        this.ClusterRepositories = ClusterRepositories;
        this.clusterName = $stateParams.clusterName;
        this.Notification = Notification;
        this.$uibModal = $uibModal;

        // Import QueuedFactory because indicies takes time and
        //   should be cancelled if not returned before leaving page.
        this.que = QueuedFactory;

        // Fetch the data
        this.fetchingRepositories = false;

        // Because on new versions of UI-ROUTER
        //  Controllers are not "Destroyed" when re-routing
        //  But $scope is.
        // Could clean up in the future and have the CONFIG
        //  user only components vs containers.
        $scope.$on('$destroy', () => {
            console.log('--- destroy called: ', this.request)
            if (this.request) this.que.cancel(this.request);
        });

        // INIT Get all Indicies
        this.fetchRepositories();
    }

    fetchRepositories() {

        this.fetchingRepositories = true;

        this.request = this.ClusterRepositories.clusterRepositories(this.clusterName);

        // #FIXME
        //  https://github.com/angular/angular.js/issues/15607
        //  Canceling the request is creating a new promise for the FINALLY Block
        //  causing a second error
        this.request.then((resp) => {
            console.log('------ repositories: ', resp.data);
            this.repositories = resp.data.data

        }).catch((err) => {
            console.log('---- err: ', err);
        }).finally(() => {
            console.log('---- done fetching');
            this.request = undefined;
            this.fetchingRepositories = false;
        });
    }
}

export default clusterSnapshotsController;
