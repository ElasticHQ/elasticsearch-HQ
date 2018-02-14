/*
*
*  Purpose is to Queue HTTP requests and have the 
*  ability to cancel as needed.  Also the ability
*  to cancel ALL requests when moving from page to page.
*
*  Should a request NOT be needed to be cancelled, 
*  such as WHO AM I, then use the standard $http provider.
*
*
*  Assumptions:
*    - You will inject the factory in your service or controller, 
*       i.e. this.queued =  QueuedFactory, just like this.$http = $http
*
*
*  Example 1: In a service instead of returning: 
*  return this.$http({ url: ('/SOME_END_POINT'),
*                 method: 'GET'
*               });
*
*  You would return 
*  return this.queued.add({ url: ('/SOME_END_POINT'),
*                             method: 'GET'
*                           });
*
*  Example 2: Canceling a request
*  this.request = this.queued.add({ url: ('/SOME_END_POINT'),
*                             method: 'GET'
*                           });
*
*  You could then cancel it by calling 
*  this.queued.cancel(this.request)
*
*/
const _queueDefaults = { method: 'GET' };

class QueuedFactory {

    // Imports go here
    constructor($q, $http) {
      'ngInject';
      
      this.$q = $q;
      this.$http = $http;

      this._id = 1;
      this.queue = [];
      
    }

    add(config) {
        let conf = Object.assign({}, _queueDefaults, config);
        let timeout = this.$q.defer(); 

        conf.timeout = timeout.promise;

        let request = this.$http(conf);
        this._id += 1;
        request.id = this._id
        this.queue.push({ request: request, cancel: timeout });

        request.finally(() => this.remove(request));
        return request;

    }

    remove(request) {
        this.queue = this.queue.filter(r => r.id !== request.id);
    }

    cancel(request) {
        let toCancel = this.queue.find(r => r.request.id === request.id);
        if (!toCancel) return;
        toCancel.cancel.resolve('Canceled by user');
    }

    cancelAll() {
        this.queue.forEach(q => q.cancel.resolve('All requests cancelled'));
        this.queue.length = 0;
    }
  
  }
  
  export default QueuedFactory;
  