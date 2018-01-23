class ClusterSummaryFactory {

  // Imports go here
  constructor($q, ClusterConnection) {
    'ngInject';
    
    this.$q = $q;
    this.service = ClusterConnection;

    // Only hold data for the current cluster name
    //  When changing clusters, clear old and fetch the current cluster
    this._currentCluster;
    this.data = {};
    this.queue = [];
    
  }

  _fetchSummary() {
    this.service.summary(this._currentCluster).then((resp) => {
        this.data.summary = resp.data.data[0];
        while (this.queue.length > 0) {
          let deferred = this.queue.shift();
          deferred.resolve(this.data.summary);
        }
      }, (err) => {
          console.log('----- err: ', err);
          while (this.queue.length > 0) {
            let deferred = this.queue.shift();
            deferred.reject(err);
          }
      })
      .finally(() => {
          this.fetching = false;
      });
  }

  getSummary(clusterName) {
    // When Cluster changes, cancel previoius requests by cloning the current list
    //  Then reset the array to help assure we are starting from a clean array
    if (this._currentCluster !== clusterName) {
      this.cancelPrevieousReqeusts([].concat(this.queue));
      this._currentCluster = clusterName;
      this.queue = [];
      this.data.summary = undefined;
    };
    let deferred = this.$q.defer();
    if (this.data.summary) {
      deferred.resolve(this.data.summary);
    } else {
      // Instead of triggering a new request for the different controllers, services, etc
      //  asking for mappings, just add them to a queue and then loop thru queue with response.
      if (!this.fetching) this.fetching = true, this._fetchSummary();
      this.queue.push(deferred);
    }
    return deferred.promise;
  }

  cancelPrevieousReqeusts(previousRequests) {
    // Clone the previous requests
    while (previousRequests.length > 0) {
      let deferred = previousRequests.shift();
      deferred.reject('Cancelled');
    }
  }

  forceReload(clusterName) {
    delete this.data.summary;
    return this.getSummary(clusterName);
  }

}

export default ClusterSummaryFactory;
