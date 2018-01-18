import './cluster-navigation.style.scss'

class clusterNavigationController {

    constructor($stateParams, ClusterSummaryFactory){
        'ngInject';

        this.clusterName = $stateParams.clusterName

        this.factory = ClusterSummaryFactory;

        if (this.clusterName) this.fetchClusterInfo();

    }

    fetchClusterInfo(){
        this.fetched = false;
        this.fetching = true;
        this.factory.getSummary(this.clusterName).then((resp) => {
            this.summary = resp;
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
