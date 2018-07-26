import './cluster-summary.style.scss';
import numeral from 'numeral';

class clusterSummaryController {
    constructor() {
        'ngInject';

        this.buildView();
    }

    $doCheck() {
        if (!angular.equals(this._prev, this.summary)) {
            this._prev = this.summary;
            this.buildView();
        }
    }

    buildView() {
        if (!this.summary) return;
        let masterArr = [];
        const formatNum = '0[.][0][0] a';
        const formatByt = '0[.][0][0] b';
        console.log('---- summary: ', this);
        this.firstRow = [
            {
                label: 'Nodes',
                value: numeral(this.summary.number_of_nodes).format(formatNum)
            },
            {
                label: 'Indices',
                value: numeral(this.summary.indices_count).format(formatNum)
            },
            {
                label: 'Documents',
                value: numeral(this.summary.number_of_documents).format(formatNum)
            },
            {
                label: 'Size',
                value: numeral(this.summary.indices_size_in_bytes).format(formatByt)
            }

        ];

        this.secondRow = [
            {
                label: 'Active Shards',
                value: numeral(this.summary.active_primary_shards).format(formatNum)
            },
            {
                label: 'Unassigned Shards',
                value: numeral(this.summary.unassigned_shards).format(formatNum)
            },
            {
                label: 'Initializing Shards',
                value: numeral(this.summary.initializing_shards).format(formatNum)
            },
            {
                label: 'Relocating Shards',
                value: numeral(this.summary.relocating_shards).format(formatNum)
            }
        ];
    }


}

export default clusterSummaryController;
