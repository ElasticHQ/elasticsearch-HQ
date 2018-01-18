import './cluster-indices.style.scss';

import _ from 'lodash';
import numeraljs from 'numeraljs';

class clusterIndicesController {

  // Imports go here
  constructor($stateParams, ClusterIndices) {
    'ngInject';

    
    
    // Fetch the data
    this.fetchingIndices = true;
    ClusterIndices.clusterInidices($stateParams.clusterName).then((resp) => {
      console.log('------ inidicies: ', resp.data)
      this.indices = resp.data.data.map((item) => {
        if (item.settings){
          if (item.settings.number_of_replicas) item.settings.number_of_replicas = parseInt(item.settings.number_of_replicas)
          if (item.settings.number_of_shards) item.settings.number_of_shards = parseInt(item.settings.number_of_shards)
        }
        return item;
      });
      this.fetchingIndices = false;
      
    }, (err) => {

    })
    .finally(() => {
      console.log('---- done fetching')
      
    });

  }

  
  
}

export default clusterIndicesController;
