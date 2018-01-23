import './clusters-button.style.scss'

class clustersButtonController {
    constructor(ClusterConnection, $state) {
        'ngInject';

        this.service = ClusterConnection;
        this.$state = $state;
        this.getClusters();

        console.log('----- in clusters button constructor')
    }

    getClusters() {
        this.service.getClusters().then((resp) => {
            this.clusters = resp.data.data;
            console.log("---- clusters: ", this.clusters)
        }, (err) => {
            console.log('---- get clusters error: ', err)
        })
    }

    goToCluster(cluster) {
        const { cluster_ip, cluster_port, cluster_scheme } = cluster;
        let params = {
            ip: cluster_ip,
            port: cluster_port,
            use_ssl: (cluster_scheme === 'https:')
        }
        this.service.connectCluster(params).then((resp) => {
            console.log('----- got something???', resp)
            let cluster = resp.data.data[0];
            console.log('----- cluster: ', cluster)
            this.$state.transitionTo('clusterDetails', {clusterName: cluster.cluster_name}, {reload: true})
            // this.$state.go('configuration.users.detail', {user_id: user.id}, {reload: true});
            console.log('----- state: ', this.$state)
        }, (err) => {

        })
    }


}

export default clustersButtonController;
