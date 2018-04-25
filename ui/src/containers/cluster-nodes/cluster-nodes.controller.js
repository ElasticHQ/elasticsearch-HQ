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
    this.socket.on('disconnect', () => { this.connected = false })
    this.socket.on('event', (data) => { this.message(data); })

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
            header: 'Heap Used',
            numFormat: '0[.][0] b',
            key: 'heap_used_in_bytes'
          },
          {
            header: 'Doduments Count',
            numFormat: '0[.][0] a',
            key: 'docs_count'
          }
        ]
      },
      {
        label: 'JVM',
        graphs: [
          {
            header: 'CPU Load',
            numFormat: '0[.][0]',
            key: 'cpu_percent'
          },
          {
            header: 'Field Data Cache',
            numFormat: '0[.][0] b',
            key: 'field_data_cache_in_bytes'
          }
        ]
      },
      {
        label: 'Thread Pools',
        graphs: []
      },
      {
        label: 'Transport',
        graphs: []
      },
      {
        label: 'Indices',
        graphs: [
          {
            header: 'Index Operations',
            numFormat: '0[.][0] a',
            key: 'index_total'
          }
        ]
      },
      {
        label: 'OS',
        graphs: []
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
            header: 'Documents Deleted',
            numFormat: '0[.][0] a',
            key: 'docs_deleted'
          },
          {
            header: 'FS Free',
            numFormat: '0[.][0] b',
            key: 'fs_free_in_bytes'
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
        if (length > 50) this._nodes[d.name].data = this._nodes[d.name].data.slice((length - 50), length)
        return d;
      });
    }
    this.$scope.$digest();
  }


}

export default clusterNodesController;
