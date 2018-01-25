import './cluster-navigation.style.scss'

class clusterNavigationController {

    constructor($stateParams, ClusterSummaryFactory, $timeout){
        'ngInject';

        this.clusterName = $stateParams.clusterName

        this.factory = ClusterSummaryFactory;

        if (this.clusterName) this.fetchClusterInfo();

    }

    fetchClusterInfo(){
        this.summary = undefined;
        this.fetched = false;
        this.fetching = true;
        this.factory.getSummary(this.clusterName).then((resp) => {
            this.summary = resp;
        })
        .catch((err) => {
            console.log('----- err: ', err);
        })
        .finally(() => {
            this.fetching = false;
            this.fetched = true;
        });
    }

    statusColor() {
        if (!this.summary) return;
        if (this.summary.status === 'green') return 'status_color_green';
        if (this.summary.status === 'yellow') return 'status_color_yellow';
        if (this.summary.status === 'red') return 'status_color_red';
    }
}

export default clusterNavigationController;
