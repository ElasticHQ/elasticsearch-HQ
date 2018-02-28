import './cluster-nodes.style.scss';

import io from 'socket.io-client';

class clusterNodesController {

  // Imports go here
  constructor($scope, $stateParams) {
    'ngInject';

    this.connected = false;

    this.clusterName = $stateParams.clusterName;
    
    this.socket = io(`ws/clusters/${this.clusterName}/nodes`);
    this.socket.on('connect', () => { this.connected = true })
    this.socket.on('disconnect', () => { this.connected = false })
    this.socket.on('event', (data) => { this.message(data); })

    $scope.$on("$destroy", () => {
      this.socket.close();
    })
  }

  message(data) {
    console.log('----- data received: ', data)
  }


}

export default clusterNodesController;
