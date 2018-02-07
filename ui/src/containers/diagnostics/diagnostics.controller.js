import './diagnostics.style.scss';

import _ from 'lodash';

class diagnosticsController {

  // Imports go here
  constructor(ClusterNodes, $stateParams) {
    'ngInject';
    
    this.service = ClusterNodes;

    this.clusterName = $stateParams.clusterName;

    this.fetchDiagnostics();
  }

  fetchDiagnostics() {
    this.service.diagnostics(this.clusterName).then((resp) => {
      console.log('---- resp: ', resp.data.data)
      this.data = _.chunk(resp.data.data, 3);

    })
  }
}

export default diagnosticsController;
