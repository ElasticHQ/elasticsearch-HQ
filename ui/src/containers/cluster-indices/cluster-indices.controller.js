import './cluster-indices.style.scss';

class clusterIndicesController {

    // Imports go here
    constructor($stateParams, ClusterIndices) {
        'ngInject';


        // Fetch the data
        this.fetchingIndices = true;
        ClusterIndices.clusterInidices($stateParams.clusterName).then((resp) => {
            console.log('------ inidicies: ', resp.data)
            this.indices = resp.data.data.map((item) => {
                if (item.settings) {
                    if (item.settings.number_of_replicas) item.settings.number_of_replicas = parseInt(item.settings.number_of_replicas)
                    if (item.settings.number_of_shards) item.settings.number_of_shards = parseInt(item.settings.number_of_shards)
                }
                return item;
            });
            this.fetchingIndices = false;

        }, (err) => {

        })
            .finally(() => {
                console.log('---- done fetching')

            });

    }

    clearCache() {
        console.log('in clear cache');
        this.fetching = true;
        this.ClusterIndices.clusterIndicesClearCache(this.clusterName).then((resp) => {
            console.log('------ response: ', resp.data)
        }).finally(() => this.fetching = false)
    }

}

export default clusterIndicesController;
