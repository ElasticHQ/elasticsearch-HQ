import './cluster-nodes.style.scss';

import * as d3 from 'd3';
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

    $scope.$on("$destroy", () => {
      this.socket.close();
    });

    this.$scope = $scope;
    this.colors = d3.scaleOrdinal(d3.schemeCategory10)
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
        if (length > 15) this._nodes[d.name].data = this._nodes[d.name].data.slice((length - 15), length)
        return d;
      });
    }
    this.$scope.$digest();
  }


}

export default clusterNodesController;
