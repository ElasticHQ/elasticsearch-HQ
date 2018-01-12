import './cluster-details.style.scss';

import _ from 'lodash';

class clusterDetailsController {

  // Imports go here
  constructor($stateParams, ClusterConnection, ClusterIndices) {
    'ngInject';
    
    this.clusterName = $stateParams.clusterName

    this.Cservice = ClusterConnection;
    this.ClusterIndices = ClusterIndices;

    this.sortOptions = [
      {
        label: 'Docs DESC',
        key: 'docs',
        order: 'desc'
      },
      {
        label: 'Docs ASC',
        key: 'docs',
        order: 'asc'
      },
      {
        label: 'Size DESC',
        key: 'size_in_bytes',
        order: 'desc'
      },
      {
        label: 'Size ASC',
        key: 'size_in_bytes',
        order: 'asc'
      },
    ]


    this.fetchingSummary = true;
    this.Cservice.summary(this.clusterName).then((resp) => {
      console.log('---- resp: ', resp.data)
      this.summary = resp.data.data[0];
    }, (err) => {
      console.log('----- err: ', err)
    })
    .finally(() => {
      this.fetchingSummary = false;
    })

    this.fetchingIndicies = true;
    this.ClusterIndices.clusterInidicies(this.clusterName).then((resp) => {
      console.log('------ inidicies: ', resp.data)
      this._data = resp.data.data;
      this.data = [].concat(this._data);
    }, (err) => {

    })
    .finally(() => {
      this.fetchingIndicies = false;
    })

    /*
    /api/indices/[cluster_name]/_summary"
     - Number of nodes
      - Number of Shardes
    /api/indices/[cluster_name]
     - List Indicies
    */
  }

  sortBy(sorter) {
    if (!sorter) return this.data = [].concat(this._data);
    let list = [].concat(this._data);
    this.data = _.orderBy(list, (e) => { 
                      return e[sorter.key]
                    }, [sorter.order]);
  }
  

}

export default clusterDetailsController;
