import './api-endpoints.style.scss';

import _ from 'lodash';

class apiEndpointsController {
    constructor($stateParams, QueuedFactory) {
        'ngInject';

        this.que = QueuedFactory;
        this.clusterName = $stateParams.clusterName;

        const options = [
            {
                group: 'Cluster',
                request_type: 'GET',
                short_label: 'Health',
                url: '_cluster_health',
                params: {}
            },
            {
                group: 'Cluster',
                request_type: 'GET',
                short_label: 'Settings',
                url: '_cluster_settings',
                params: {}
            },
            {
                group: 'Cluster',
                request_type: 'GET',
                short_label: 'State',
                url: '_cluster_state',
                params: {}
            },
            {
                group: 'Cluster',
                request_type: 'GET',
                short_label: 'Stats',
                url: '_cluster_stats',
                params: {}
            },
            {
                group: 'Cluster',
                request_type: 'GET',
                short_label: 'Status',
                url: '_cluster_status',
                params: {}
            },
            {
                group: 'Nodes',
                request_type: 'GET',
                short_label: 'Info',
                url: '_nodes',
                params: {all: true}
            },
            {
                group: 'Nodes',
                request_type: 'GET',
                short_label: 'Stats',
                url: '_nodes_stats',
                params: {all: true}
            },
            {
                group: 'Indices',
                request_type: 'GET',
                short_label: 'Aliases',
                url: '_indices_aliases',
                params: {}
            },
            {
                group: 'Indices',
                request_type: 'GET',
                short_label: 'Info',
                url: '_indices_info',
                params: {}
            },
            {
                group: 'Indices',
                request_type: 'GET',
                short_label: 'Stats',
                url: '_indices_stats',
                params: {all: true}
            },
            {
                group: 'Indices',
                request_type: 'GET',
                short_label: 'Mappings',
                url: '_indices_mappings',
                params: {}
            },
            {
                group: 'Indices',
                request_type: 'GET',
                short_label: 'Templates',
                url: '_indices_templates',
                params: {}
            },
            {
                group: 'Indices',
                request_type: 'GET',
                short_label: 'Segments',
                url: '_indices_segments',
                params: {}
            },
            {
                group: 'Indices',
                request_type: 'GET',
                short_label: 'Shard Stores',
                url: '_indices_shard_stores',
                params: {}
            },
            {
                group: 'Indices',
                request_type: 'GET',
                short_label: 'Recovery',
                url: '_indices_recovery',
                params: {}
            },
            {
                group: 'Cat',
                request_type: 'GET',
                short_label: 'Aliases',
                url: '_cat_aliases',
                params: {}
            },
            {
                group: 'Cat',
                request_type: 'GET',
                short_label: 'Allocation',
                url: '_cat_allocation',
                params: {}
            },
            {
                group: 'Cat',
                request_type: 'GET',
                short_label: 'Count',
                url: '_cat_count',
                params: {}
            },
            {
                group: 'Cat',
                request_type: 'GET',
                short_label: 'Fielddata',
                url: '_cat_fielddata',
                params: {}
            },
            {
                group: 'Cat',
                request_type: 'GET',
                short_label: 'Health',
                url: '_cat_health',
                params: {}
            },
            {
                group: 'Cat',
                request_type: 'GET',
                short_label: 'Indices',
                url: '_cat_indices',
                params: {}
            },
            {
                group: 'Cat',
                request_type: 'GET',
                short_label: 'Master',
                url: '_cat_master',
                params: {}
            },
            {
                group: 'Cat',
                request_type: 'GET',
                short_label: 'Node Attrs',
                url: '_cat_nodeattrs',
                params: {}
            },
            {
                group: 'Cat',
                request_type: 'GET',
                short_label: 'Nodes',
                url: '_cat_nodes',
                params: {}
            },
            {
                group: 'Cat',
                request_type: 'GET',
                short_label: 'Pending Tasks',
                url: '_cat_pending_tasks',
                params: {}
            },
            {
                group: 'Cat',
                request_type: 'GET',
                short_label: 'Plugins',
                url: '_cat_plugins',
                params: {}
            },
            {
                group: 'Cat',
                request_type: 'GET',
                short_label: 'Recovery',
                url: '_cat_recovery',
                params: {}
            },
            {
                group: 'Cat',
                request_type: 'GET',
                short_label: 'Thread Pool',
                url: '_cat_thread_pool',
                params: {}
            },
            {
                group: 'Cat',
                request_type: 'GET',
                short_label: 'Shards',
                url: '_cat_shards',
                params: {}
            },
            {
                group: 'Cat',
                request_type: 'GET',
                short_label: 'Segments',
                url: '_cat_segments',
                params: {}
            },
            {
                group: 'HQ',
                request_type: 'GET',
                short_label: 'Status',
                url: '_hq_status',
                params: {}
            },
            {
                group: 'HQ',
                request_type: 'GET',
                short_label: 'Cluster Summary',
                url: '_hq_cluster_summary',
                params: {}
            },
            {
                group: 'HQ',
                request_type: 'GET',
                short_label: 'Cluster List',
                url: '_hq_cluster_list',
                params: {}
            }
        ];

        // NOTE we are calling sortBy followed by groupBy
        //  Because we want to help guarantee that OBJ
        //  returned will be in alphabetical order.
        this.groupedOptions = _(options).chain()
            .sortBy(['group', 'short_label'])
            .groupBy('group')
            .valueOf();
    }

    optionClicked(option) {
        console.log('--- option clicked: ', option);


        if (this.request) this.que.cancel(this.request);
        // Clear what was previously rendered
        this._toRender = undefined;
        // Spinner
        this._isFetching = true;

        // Configure the request object
        const urlConfig = {
            url: '/api/rest/' + this.clusterName + '/' + option.url,
            method: option.request_type,
            params: option.params
            //params: Object.assign({}, option.params, {endpoint: option.url})
        };

        // Assign it to a variable that could be cancelled
        this.request = this.que.add(urlConfig);

        // Loop deferred object as normal.
        this.request.then((resp) => {
            console.log('---- resp: ', resp.data.data)
            let data = resp.data.data;
            if (data.length > 1) {
                this._toRender = JSON.stringify(data, null, 2);
            }
            else
            {
                this._toRender = JSON.stringify(data[0], null, 2);
            }
            this._isFetching = false;
        }).catch((err) => {
            console.log('---- err: ', err)
            this._isFetching = false;
        });

    }
}

export default apiEndpointsController;
