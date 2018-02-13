import './top-nav.style.scss'

class topNavController {
    constructor(ClusterConnection, Notification, $state, $transitions, $location, $rootScope) {
        'ngInject';

        // Get URL to determin if ROOT or not
        this.$location = $location;

        this.service = ClusterConnection;
        this.$state = $state;
        this.Notification = Notification;


        // when adding / removing a cluster from settings
        $rootScope.$on('clusters.refresh', (event, data) => {
            this.getClusters();
        });

        this.getClusters();

        this.seeIfNotRoot();

        // Function call to 
        $transitions.onSuccess({}, (trans) => {
            this.seeIfNotRoot();
        });
    }

    seeIfNotRoot(){
        this.isNotRoot = this.$location.$$path !== '/';
    }

    getClusters(reloading) {
        this.service.getClusters().then((resp) => {
            this.clusters = resp.data.data;
            if (!!reloading) this.Notification.success({message: `Found ${this.clusters.length} clusters`, delay: 3000});
            console.log("---- clusters: ", this.clusters)
        }, (err) => {
            this.Notification.error({message: 'Error getting clusters'});
            console.log('---- get clusters error: ', err)
        })
    }

    
}

export default topNavController;
