import './cluster-summary.style.scss';
import numeraljs from 'numeraljs';

class clusterSummaryController {
    constructor() {
        'ngInject';

        this.buildView();
    }

    $doCheck() {
        if(!angular.equals(this._prev, this.summary)){
            this._prev = this.summary;
            this.buildView();
        }
    }

    buildView() {
        if (!this.summary) return;
        let masterArr = [];
        const formatNum = '0[.][0][0]a';
        const formatByt = '0[.][0][0]b';
        console.log('---- summary: ', this)
        this.firstRow = [
            {
                label: 'Nodes',
                value: numeraljs(this.summary.number_of_nodes).format(formatNum)
            },
            {
                label: 'Total Shards',
                value: numeraljs(this.summary.active_shards).format(formatNum)
            },
            {
                label: 'Successful Shards',
                value: numeraljs(this.summary.active_primary_shards).format(formatNum)
            },
            {
                label: 'Indicies',
                value: numeraljs(this.summary.indices_count).format(formatNum)
            },
            {
                label: 'Documents',
                value: numeraljs(this.summary.number_of_documents).format(formatByt)
            },
            {
                label: 'Size',
                value: numeraljs(this.summary.indices_size_in_bytes).format(formatByt)
            }
        ]
    }

    statusColor() {
        if (!this.summary) return;
        if (this.summary.status === 'green') return 'label-success';
        if (this.summary.status === 'yellow') return 'label-warning';
        if (this.summary.status === 'red') return 'label-danger';
    }
}

export default clusterSummaryController;
