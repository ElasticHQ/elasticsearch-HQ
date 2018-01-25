import './cluster-indices.style.scss';

class clusterIndicesController {

    // Imports go here
    constructor($stateParams, ClusterIndices, QueuedFactory, $scope) {
        'ngInject';

        this.ClusterIndices = ClusterIndices;
        this.clusterName = $stateParams.clusterName;

        // Import QueuedFactory because indicies takes time and 
        //   should be cancelled if not returned before leaving page.
        this.que = QueuedFactory;

        // Fetch the data
        this.fetchingIndices = true;

        // Because on new versions of UI-ROUTER
        //  Controllers are not "Destroyed" when re-routing
        //  But $scope is.
        // Could clean up in the future and have the CONFIG
        //  user only components vs containers.
        $scope.$on('$destroy', () => { 
            console.log('--- destroy called: ', this.request)
            if (this.request) this.que.cancel(this.request);
        })

        this.request = ClusterIndices.clusterInidices($stateParams.clusterName)
        
        // #FIXME
        //  https://github.com/angular/angular.js/issues/15607
        //  Canceling the request is creating a new promise for the FINALLY Block
        //  causing a second error
        this.request.then((resp) => {
                console.log('------ inidicies: ', resp.data)
                this.indices = resp.data.data.map((item) => {
                    if (item.settings) {
                        if (item.settings.number_of_replicas) item.settings.number_of_replicas = parseInt(item.settings.number_of_replicas)
                        if (item.settings.number_of_shards) item.settings.number_of_shards = parseInt(item.settings.number_of_shards)
                    }
                    return item;
                });
                this.fetchingIndices = false;

            }).catch((err) => {
                console.log('---- err: ', err);
            }).finally(() => {
                console.log('---- done fetching')
                this.request = undefined;
            });

    }

    clearCache() {
        this.fetching = true;
        this.ClusterIndices.clusterIndicesClearCache(this.clusterName).then((resp) => {
            console.log('------ response: ', resp.data)
        }).finally(() => this.fetching = false)
    }
    flushCache() {
        this.fetching = true;
        this.ClusterIndices.clusterIndicesFlush(this.clusterName).then((resp) => {
            console.log('------ response: ', resp.data)
        }).finally(() => this.fetching = false)
    }
    refreshIndex() {
        this.fetching = true;
        this.ClusterIndices.clusterIndicesRefresh(this.clusterName).then((resp) => {
            console.log('------ response: ', resp.data)
        }).finally(() => this.fetching = false)
    }
    forceMergeIndex() {
        this.fetching = true;
        this.ClusterIndices.clusterIndicesForceMerge(this.clusterName).then((resp) => {
            console.log('------ response: ', resp.data)
        }).finally(() => this.fetching = false)
    }

}

export default clusterIndicesController;
