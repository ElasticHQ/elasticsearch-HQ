import './api-endpoints.style.scss';

import _ from 'lodash';

class apiEndpointsController {
    constructor(QueuedFactory) {
        'ngInject';

        this.que = QueuedFactory;

        const options = [
            {
              group: 'Cluster',
              request_type: 'GET',
              short_label: 'Health',
              url: '_cluster/health',
              params: {}
            },
            {
              group: 'Cluster',
              request_type: 'GET',
              short_label: 'State',
              url: '_cluster/state',
              params: {}
            },
            {
              group: 'Cluster',
              request_type: 'GET',
              short_label: 'Settings',
              url: '_cluster/settings',
              params: {}
            },
            {
              group: 'Cluster',
              request_type: 'GET',
              short_label: 'Ping',
              url: '',
              params: {}
            },
            {
              group: 'Nodes',
              request_type: 'GET',
              short_label: 'Info',
              url: '_cluster/nodes',
              params: {all: true}
            },
            {
              group: 'Nodes',
              request_type: 'GET',
              short_label: 'Stats',
              url: '_cluster/nodes/stats',
              params: {all: true}
            },
            {
              group: 'Indices',
              request_type: 'GET',
              short_label: 'Aliases',
              url: '_aliasses',
              params: {}
            },
            {
              group: 'Indices',
              request_type: 'GET',
              short_label: 'Settings',
              url: '_settings',
              params: {}
            },
            {
              group: 'Indices',
              request_type: 'GET',
              short_label: 'Stats',
              url: '_stats',
              params: {all: true}
            },
            {
              group: 'Indices',
              request_type: 'GET',
              short_label: 'Status',
              url: '_status',
              params: {}
            },
            {
              group: 'Indices',
              request_type: 'GET',
              short_label: 'Segments',
              url: '_segments',
              params: {}
            },
            {
              group: 'Indices',
              request_type: 'GET',
              short_label: 'Mappings',
              url: '_mapping',
              params: {}
            },
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
        console.log('--- option clicked: ', option)

        // would do something like: 

        // if (this.request) this.que.cancel(this.request);
        // // Clear what was previously rendered
        // this._toRender = undefined;
        // // Spinner
        // this._isFetching = true;

        // // Configure the request object
        // const urlConfig = {
        //     url = `/api/_PENDING_ENDPOING/${option.url}`,
        //     method: option.request_type,
        //     params: option.params
        // }

        // // Assign it to a variable that could be cancelled
        // this.request = this.que.add(urlConfig);

        // // Loop deferred object as normal.
        // this.request.then((resp) => {
        //     console.log('---- resp: ', resp.data.data)
        //     let data = resp.data.data[0];
        //     this._toRender = JSON.stringify(data, null, 2);
        //     this._isFetching = false;
        // }).catch((err) => {
        //     console.log('---- err: ', err)
        //     this._isFetching = false;
        // });

    }
}

export default apiEndpointsController;
