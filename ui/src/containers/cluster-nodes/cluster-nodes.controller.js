import './cluster-nodes.style.scss';

import io from 'socket.io-client';

class clusterNodesController {

  // Imports go here
  constructor($scope, $stateParams) {
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
    baseUrl = baseUrl += `/ws/nodes/${this.clusterName}/nodes`;
    // baseUrl = baseUrl += `/ws/nodes`;
    console.log('---- baseUrl: ', baseUrl)
    
    this.socket = io(baseUrl);
    this.socket.on('connect', () => { 
      this.connected = true;
      this.socket.emit('join', {"cluster_name": this.clusterName, "metrics" : "nodes"});
     })
    this.socket.on('disconnect', () => { this.connected = false })
    this.socket.on('event', (data) => { this.message(data); })

    console.log('----- this.socket: ', this.socket)

    $scope.$on("$destroy", () => {
      this.socket.close();
    })
  }

  message(data) {
    console.log('----- data received: ', data)
  }


}

export default clusterNodesController;
