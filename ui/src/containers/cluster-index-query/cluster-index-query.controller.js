import './cluster-index-query.style.scss';

import JSONEditor from 'jsoneditor/dist/jsoneditor';

class clusterIndexQueryController {

  // Imports go here
  constructor(ClusterIndices, $stateParams, $scope) {
    'ngInject';

    this.service = ClusterIndices;

    this.clusterName = $stateParams.clusterName;
    this.$scope = $scope;
    this.indicies = [];
    this.previouslyQueried = {};

    this.onChange = this.onChange.bind(this)
    let queryEditor = angular.element(document.querySelector('.query-editor'))[0]

    let queryOptions = {
      mode: 'code',
      onChange: (val) => this.onChange(val),
    }

    this.queryEditor = new JSONEditor(queryEditor, queryOptions)
    // By Default this should not be editable until
    //  and index is selected
    this.validQuery = false;

    // query-response
    let responseEditor = angular.element(document.querySelector('.query-response'))[0]

    let responseOptions = {
      mode: 'tree',
    }

    this.responseEditor = new JSONEditor(responseEditor, responseOptions)
  }

  onChange() {
    console.log('---- change seen')
    // see if query is valid
    try {
      let query = JSON.stringify(this.queryEditor.get());
      // If above fails, this section will not be executed
      this.validQuery = true;
      if (!this.currentIndex) return;
      this.previouslyQueried[this.currentIndex.index_name] = JSON.parse(query)
    } catch (err) {
      this.validQuery = false
    }
    this.$scope.$digest()
  }

  $onInit() {
    this.disabled = true
    this.service.clusterInidices(this.clusterName).then(resp => {
      this.indicies = resp.data.data
    }).finally(() => this.disabled = false)

  }

  indexSelected(index) {
    this.currentIndex = index;

    // Provide a starting point?
    if (!this.previouslyQueried[index.index_name]) {

      this.previouslyQueried[index.index_name] = {
                                                    "query": { 
                                                      "match_all": {} 
                                                    },
                                                    "from": 0,
                                                    "size": 10
                                                  }
      
      this.validQuery = true
    }

    // Since we are starting with what should be valid JSON
    // Let user query with this.
    this.queryEditor.set(this.previouslyQueried[index.index_name])
  }

  query() {
    this.responseData = undefined
    let query = this.queryEditor.get();
    this.service.queryCluster(this.clusterName, this.currentIndex.index_name, query).then(resp => {
      this.responseData = resp.data;
      this.responseEditor.set(this.responseData);

    }, (err) => {
      console.log('--- query resp error: ', err)
    })
  }


}

export default clusterIndexQueryController;
