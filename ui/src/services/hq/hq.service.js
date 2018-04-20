class HqService {

  // Imports go here
  constructor(QueuedFactory) {
    'ngInject';
    
    this.que = QueuedFactory;
  }


  settings(cluster_name) {
    return this.que.add({
      url: ('api/hq/' + cluster_name + '/_settings'),
      method: 'GET'
    });
  }

  resetSettings(cluster_name) {
    return this.que.add({
      url: ('api/hq/' + cluster_name + '/_settings'),
      method: 'DELETE'
    });
  }

  updateSettings(cluster_name, data) {
    return this.que.add({
      url: ('api/hq/' + cluster_name + '/_settings'),
      method: 'PUT',
      data: data
    });
  }
}

export default HqService;
