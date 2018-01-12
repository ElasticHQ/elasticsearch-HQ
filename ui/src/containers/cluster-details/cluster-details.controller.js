import './cluster-details.style.scss'

class clusterDetailsController {

  // Imports go here
  constructor($stateParams, ClusterConnection, ClusterIndices) {
    'ngInject';
    
    this.clusterName = $stateParams.clusterName

    this.Cservice = ClusterConnection;
    this.ClusterIndices = ClusterIndices;

    this.data = {};

    this.fetchingSummary = true;
    this.Cservice.summary(this.clusterName).then((resp) => {
      console.log('---- resp: ', resp.data)
      this._summaryData = resp.data.data;
      this.buildData();
    }, (err) => {
      console.log('----- err: ', err)
    })
    .finally(() => {
      this.fetchingSummary = false;
    })

    this.fetchingIndicies = true;
    this.ClusterIndices.clusterInidicies(this.clusterName).then((resp) => {
      console.log('------ inidicies: ', resp.data)
      this._indicieData = resp.data.data[0];
      this.buildData();
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

  buildData() {
    console.log('----- buildData', this._summaryData, this._indicieData)
    if (!this._summaryData || !this._indicieData) return this.data = {};
    console.log('------ should build now')
    this._summaryData.forEach((s) => {
      this.data[s.index_name] = {summary: s}
    });

    Object.keys(this._indicieData).map((key) => {
      this.data[key] = Object.assign(this.data[key], this._indicieData[key])
    });

    console.log('---- data: ', this.data)
  }

  

}

export default clusterDetailsController;
