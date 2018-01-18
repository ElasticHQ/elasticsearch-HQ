import './cluster-navigation.style.scss'

class clusterNavigationController {

    constructor($stateParams, ClusterConnection){
        'ngInject';

        this.clusterName = $stateParams.clusterName

        this.Cservice = ClusterConnection;

        if (this.clusterName) this.fetchClusterInfo();

    }

    fetchClusterInfo(){
        this.fetched = false;
        this.fetching = true;
        this.Cservice.summary(this.clusterName).then((resp) => {
        console.log('---- resp: ', resp.data)
        this.summary = resp.data.data[0];
        }, (err) => {
        console.log('----- err: ', err)
        })
        .finally(() => {
            this.fetching = false;
            this.fetched = true;
        });
    }

    statusColor() {
        if (!this.summary) return;
        if (this.summary.status === 'green') return 'label-success';
        if (this.summary.status === 'yellow') return 'label-warning';
        if (this.summary.status === 'red') return 'label-danger';
    }
}

export default clusterNavigationController;
