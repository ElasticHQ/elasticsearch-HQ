import './clusters-button.style.scss'

class clustersButtonController {
    constructor(ClusterConnection, $state, Notification, $rootScope) {
        'ngInject';

        this.service = ClusterConnection;
        this.$state = $state;
        this.Notification = Notification;

        $rootScope.$on('clusters.refresh', (event, data) => {
            this.getClusters();
        });

        this.getClusters();

        console.log('----- in clusters button constructor')
    }

    getClusters() {
        this.service.getClusters().then((resp) => {
            this.clusters = resp.data.data;
            this.Notification.success({message: `Found ${this.clusters.length} clusters`, delay: 3000});
            console.log("---- clusters: ", this.clusters)
        }, (err) => {
            this.Notification.error({message: 'Error getting clusters'});
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
        this.$state.transitionTo('clusterDetails', {clusterName: cluster.cluster_name}, {reload: true})
        // this.service.connectCluster(params).then((resp) => {
        //     let cluster = resp.data.data[0];
        //     this.$state.transitionTo('clusterDetails', {clusterName: cluster.cluster_name}, {reload: true})
        //     // this.$state.go('configuration.users.detail', {user_id: user.id}, {reload: true});
        // }, (err) => {
        //     let msg = (err.data && err.data.message) ? err.data.message : 'Error connecting to cluster'
        //     this.Notification.error({message: msg});
        // })
    }


}

export default clustersButtonController;
