import './clusters.style.scss';

import _ from 'lodash';
import numeral from 'numeral';

class clustersController {
    constructor(ClusterConnection, Notification, $state, $sce, $filter) {
        'ngInject';

        this.service = ClusterConnection;

        this.Notification = Notification;
        this.$state = $state;
        this.$sce = $sce;
        this.$filter = $filter;

        this.search = { text: "" };

        const formatNum = '0[.][0][0]a';
        const formatByt = '0[.][0][0] b'; 

        this.columns = [
            {
                label: 'Cluster',
                key: 'cluster_name'
            },
            {
                label: 'Host',
                key: 'cluster_host'
            },
            {
                label: 'Active Shards',
                key: 'cluster_health.active_primary_shards',
                formatter: formatNum
            },
            {
                label: 'Total Shards',
                key: 'cluster_health.active_shards',
                formatter: formatNum
            },
            {
                label: 'Data Nodes',
                key: 'cluster_health.number_of_data_nodes',
                formatter: formatNum
            },
            {
                label: 'Total Nodes',
                key: 'cluster_health.number_of_nodes',
                formatter: formatNum
            },
        ];

        this.filterFn = this.filterFn.bind(this);

        this.getClusters();
    }

    getClusters() {
        this.service.getClusters().then((resp) => {
            this.clusters = resp.data.data;
            console.log("---- clusters: ", this.clusters)
        }, (err) => {
            this.Notification.error({message: 'Error getting clusters'});
            console.log('---- get clusters error: ', err)
        })
    }

    renderCell(obj, col){
        let val = _.get(obj, col.key);
        if (col.key === 'cluster_name') {
            let url = this.$state.href("clusterDetails", {clusterName: val})
            let str = '<a href="' + url + '">' + val + '</a>';
            return this.$sce.trustAsHtml(str);
        }
        if (!col.formatter) return this.$sce.trustAsHtml(val);
        return this.$sce.trustAsHtml(numeral(val).format(col.formatter));
    }

    deleteCluster(cluster_name){
        console.log("in delete: ", this);
        this.fetching = true;
        this.service.deleteCluster(cluster_name).then((resp) => {
            console.log('------ response: ', resp.data)
            this.Notification.success({message: `Connection deleted.`, delay: 3000});
            if (this.fetchFn && (typeof this.fetchFn === 'function')) this.fetchFn();
        }, (err) => {
            let msg = `Delete Connection Failed. ${err.status}`;
            try {
                msg += `<br /> ${err.data.message}`;
            } catch (err) { }
            this.Notification.error({message: msg, delay: 5000});
        }).finally(() => this.fetching = false)
    }

    filterFn(item) {
        let filtered = (this.search.text && this.search.text.length) ?
                          this.$filter('filter')([item], this.search.text).length :
                          1;
        return !!filtered;
    }
}

export default clustersController;
