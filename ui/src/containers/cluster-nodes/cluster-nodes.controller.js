import './cluster-nodes.style.scss';

import * as d3 from 'd3';
import _ from 'lodash';
import io from 'socket.io-client';

class clusterNodesController {

    // Imports go here
    constructor($scope, $stateParams, $element) {
        'ngInject';

        this.connected = false;
        this.clusterName = $stateParams.clusterName;

        // Try to get URL
        //  even if path is being forwared by a Apache / Nginx conf.
        //  i.e. http://my_site.com/my/custom/path is the root of the python app
        console.log('---- window.location', window.location)
        let baseUrl = window.location.href.split('/#!')[0];

        if (/\:8080/.test(baseUrl)) baseUrl = 'http://localhost:5000';

        // Websockets do not work with relative paths, so get absolute and append the WS portion
        //  upgrade from HTTP to WS should be automatic
        // baseUrl = baseUrl += `/ws/nodes/${this.clusterName}/nodes`;
        baseUrl = baseUrl += `/ws`;
        // console.log('---- baseUrl: ', baseUrl)

        this.socket = io(baseUrl);
        this.socket.on('connect', () => {
            this.connected = true;
            this.socket.emit('join', {"room_name": this.clusterName + "::nodes"});
        })
        this.socket.on('disconnect', () => {
            this.connected = false
        })
        this.socket.on('event', (data) => {
            this.message(data);
        })

        // When tab in the background browsers like chrome
        //    throttle CPU / Tasks like animations, so we
        //    STOP the animation from rendering by passing this flag.
        // When Animation continues, it will update the graph to the
        //    latest information.
        // NOTE: we stop the animation, but not collecting the info
        //    from the websockets.
        this.allow_rendering = true;
        this.visibilityCallBack = () => {
            this.allow_rendering = document.visibilityState == 'visible'
        }
        document.addEventListener("visibilitychange", this.visibilityCallBack);


        $scope.$on("$destroy", () => {
            this.socket.close();
            document.removeEventListener('visibilitychange', this.visibilityCallBack)
        });

        this.$scope = $scope;
        this.colors = d3.scaleOrdinal(d3.schemeCategory10);

        let groupedGraphs = [
            {
                label: 'Summary',
                graphs: [
                    {
                        header: 'Store Size',
                        numFormat: '0[.][0] b',
                        key: 'store_size'
                    },
                    {
                        header: 'Heap Used',
                        numFormat: '0[.][0] b',
                        key: 'heap_used_in_bytes'
                    },
                    {
                        header: 'Document Count',
                        numFormat: '0[.][0] a',
                        key: 'docs_count'
                    },
                    {
                        header: 'Documents Deleted',
                        numFormat: '0[.][0] a',
                        key: 'docs_deleted'
                    },
                    {
                        header: 'FS Used',
                        numFormat: '0[.][0] b',
                        key: 'fs_used_in_bytes'
                    },
                    {
                        header: 'FS Free',
                        numFormat: '0[.][0] b',
                        key: 'fs_free_in_bytes'
                    }
                ]
            },
            {
                label: 'OS',
                graphs: [{
                    header: 'Load Average',
                    numFormat: '0[.][0] a',
                    key: 'os_load_average'
                },
                    {
                        header: 'CPU Percent',
                        numFormat: '0[.][0] a',
                        key: 'os_cpu_percent'
                    },
                    {
                        header: 'OS Memory Free',
                        numFormat: '0[.][0] b',
                        key: 'os_mem_free_in_bytes'
                    },
                    {
                        header: 'OS Memory Used',
                        numFormat: '0[.][0] b',
                        key: 'os_mem_used_in_bytes'
                    },
                    {
                        header: 'Swap Free',
                        numFormat: '0[.][0] b',
                        key: 'os_swap_free_in_bytes'
                    },
                    {
                        header: 'Swap Used',
                        numFormat: '0[.][0] b',
                        key: 'os_swap_used_in_bytes'
                    },
                    {
                        header: 'Open File Descriptors',
                        numFormat: '0[.][0] a',
                        key: 'process_open_file_descriptors'
                    }]
            },
            {
                label: 'Filesystem',
                graphs: [
                    {
                        header: 'FS Used',
                        numFormat: '0[.][0] b',
                        key: 'fs_used_in_bytes'
                    },
                    {
                        header: 'FS Free',
                        numFormat: '0[.][0] b',
                        key: 'fs_free_in_bytes'
                    }
                ]
            },
            {
                label: 'JVM',
                graphs: [
                    // {
                    //   header: 'CPU Load',
                    //   numFormat: '0[.][0]',
                    //   key: 'cpu_percent'
                    // },
                    {
                        header: 'Heap Used',
                        numFormat: '0[.][0] b',
                        key: 'heap_used_in_bytes'
                    },
                    {
                        header: 'Threads',
                        numFormat: '0[.][0] a',
                        key: 'jvm_threads_count'
                    },
                    {
                        header: 'JVM GC (Old) Count',
                        numFormat: '0[.][0] a',
                        key: 'jvm_gc_old_count'
                    },
                    {
                        header: 'JVM GC (Young) Count',
                        numFormat: '0[.][0] a',
                        key: 'jvm_gc_young_count'
                    }
                ]
            },
            {
                label: 'Thread Pools',
                graphs: [{
                    header: 'Bulk: Completed',
                    numFormat: '0[.][0] a',
                    key: 'tp_bulk_completed'
                },
                    {
                        header: 'Bulk: Queue',
                        numFormat: '0[.][0] a',
                        key: 'tp_bulk_queue'
                    },
                    {
                        header: 'Get: Completed',
                        numFormat: '0[.][0] a',
                        key: 'tp_get_completed'
                    },
                    {
                        header: 'Get: Queue',
                        numFormat: '0[.][0] a',
                        key: 'tp_get_queue'
                    },
                    {
                        header: 'Index: Completed',
                        numFormat: '0[.][0] a',
                        key: 'tp_index_completed'
                    },
                    {
                        header: 'Index: Queue',
                        numFormat: '0[.][0] a',
                        key: 'tp_index_queue'
                    },
                    {
                        header: 'Search: Completed',
                        numFormat: '0[.][0] a',
                        key: 'tp_search_completed'
                    },
                    {
                        header: 'Search: Queue',
                        numFormat: '0[.][0] a',
                        key: 'tp_search_queue'
                    }]
            },
            {
                label: 'Transport',
                graphs: [{
                    header: 'Received Count',
                    numFormat: '0[.][0] a',
                    key: 'transport_rx_count'
                },
                    {
                        header: 'Received Size',
                        numFormat: '0[.][0] b',
                        key: 'transport_rx_size_in_bytes'
                    },
                    {
                        header: 'Sent Count',
                        numFormat: '0[.][0] a',
                        key: 'transport_tx_count'
                    },
                    {
                        header: 'Sent Size',
                        numFormat: '0[.][0] b',
                        key: 'transport_tx_size_in_bytes'
                    },
                    {
                        header: 'HTTP Current Open',
                        numFormat: '0[.][0] a',
                        key: 'http_current_open'
                    },
                    {
                        header: 'HTTP Total Opened',
                        numFormat: '0[.][0] a',
                        key: 'http_total_opened'
                    }]
            },
            {
                label: 'Indexing',
                graphs: [
                    {
                        header: 'Indexing Total',
                        numFormat: '0[.][0] a',
                        key: 'indexing_total'
                    },
                    {
                        header: 'Indexing Failed',
                        numFormat: '0[.][0] a',
                        key: 'indexing_failed'
                    },
                    {
                        header: 'Delete Total',
                        numFormat: '0[.][0] a',
                        key: 'delete_total'
                    }
                ]
            },
            {
                label: 'Fetching',
                graphs: [{
                    header: 'Get Count',
                    numFormat: '0[.][0] a',
                    key: 'get_total'
                },
                    {
                        header: 'Fetch Count',
                        numFormat: '0[.][0] a',
                        key: 'fetch_total'
                    },
                    {
                        header: 'Query Count',
                        numFormat: '0[.][0] a',
                        key: 'query_total'
                    },
                    {
                        header: 'Scroll Count',
                        numFormat: '0[.][0] a',
                        key: 'scroll_total'
                    },
                    {
                        header: 'Exists Count',
                        numFormat: '0[.][0] a',
                        key: 'exists_total'
                    },
                    {
                        header: 'Missing Count',
                        numFormat: '0[.][0] a',
                        key: 'missing_total'
                    }]
            },
            {
                label: 'Cache',
                graphs: [{
                    header: 'Field Data Cache Evictions',
                    numFormat: '0[.][0] a',
                    key: 'cache_fd_evictions'
                },
                    {
                        header: 'Field Data Cache Size',
                        numFormat: '0[.][0] b',
                        key: 'cache_fd_memory_size_in_bytes'
                    },
                    {
                        header: 'Query Cache Hit Count',
                        numFormat: '0[.][0] a',
                        key: 'cache_qc_hit_count'
                    },
                    {
                        header: 'Query Cache Miss Count',
                        numFormat: '0[.][0] a',
                        key: 'cache_qc_miss_count'
                    },
                    {
                        header: 'Query Cache Memory Size',
                        numFormat: '0[.][0] b',
                        key: 'cache_qc_memory_size_in_bytes'
                    },
                    {
                        header: 'Query Cache Item Count',
                        numFormat: '0[.][0] a',
                        key: 'cache_qc_cache_count'
                    },
                    {
                        header: 'Query Cache Evictions',
                        numFormat: '0[.][0] a',
                        key: 'cache_qc_evictions'
                    }]
            },
            {
                label: 'Misc.',
                graphs: [
                    {
                        header: 'Index Operations',
                        numFormat: '0[.][0] a',
                        key: 'index_total'
                    }
                ]
            }
        ];

        // Doing it like this because if we want to change the grouping
        //   later on, it's easier.
        this.groupedGraphs = groupedGraphs.map(grp => {
            grp.graphs = _.chunk(grp.graphs, 2);
            return grp;
        });

        this.selectedGraph = this.groupedGraphs[0];

        console.log('---- this.groupedGraphs: ', this.groupedGraph)

    }

    $onInit() {
        // How we keep track of what nodes are being monitored.
        // In future release, will be used as a way to render
        //  master legend that will turn noded on and off for each
        //  graph.
        this._nodes = {};
    }

    message(data) {
        if (data.data && data.data !== 'Connected') {
            data.data = JSON.parse(data.data)
            let date = new Date();
            data.data.map((d) => {
                d.date = date;
                if (!this._nodes[d.name]) this._nodes[d.name] = {data: [], color: this.colors(d.name), active: true};
                this._nodes[d.name].data.push(d);
                let length = this._nodes[d.name].data.length;
                if (length > 200) this._nodes[d.name].data = this._nodes[d.name].data.slice((length - 200), length)
                return d;
            });
        }
        this.$scope.$digest();
    }


}

export default clusterNodesController;
