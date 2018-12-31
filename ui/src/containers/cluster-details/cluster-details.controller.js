import './cluster-details.style.scss';

import _ from 'lodash';
import numeral from 'numeral';

let currentPageName = "cDetailsCurrentPage";
let currentPerPageName = "cDetailsPerPage"
let currentSortName = "cDetailsSortedBy";
let currentSortOrder = "cDetailsSortOrder";

class clusterDetailsController {

  // Imports go here
  constructor($stateParams, ClusterIndices, ClusterNodes, $scope, $location) {
    'ngInject';
    
    this.clusterName = $stateParams.clusterName

    this.ClusterIndices = ClusterIndices;
    this.ClusterNodes = ClusterNodes;

    this.fetchingIndices = true;
    this.ClusterIndices.clusterInidices(this.clusterName).then((resp) => {
      // console.log('------ inidicies: ', resp.data.data)
      this.indices = resp.data.data;

    })
    .catch((err) => {
      console.log('---- err: ', err)
    })
    .finally(() => {
      this.fetchingIndices = false;
    });

    this.ClusterNodes.getNodesSummary(this.clusterName).then((resp) => {
      // console.log('---- new nodes summary: ', resp.data.data)
      let data = resp.data.data;
      this.nodes = data.map((node) => {
        // let { fs } = node;
        // node.jvm.used_percent = node.jvm.heap_used_percent / 100;
        // let used = fs.total_in_bytes - fs.available_in_bytes;
        // fs.used_in_percent = (used / fs.total_in_bytes); /// 100;
        return node;
      })
    })

    // BELOW STARTS ALL ITEMS NEEDED TO SUPPORT store / retrieve
    //  * sorted column & order
    //  * Current Page
    //  * Selected Per Page count
    
    
    // extract current search params
    let search = $location.search();
    this.currentSort = {};
    if (search[currentSortName]) {
      this.currentSort.name = search[currentSortName]
      this.currentSort.order = search[currentSortOrder] === 'DESC' ? 'descending' : true;
    }

    // Determine if we are on another page
    let currentPage = search[currentPageName] ? parseInt(search[currentPageName]) : 1;
    this.currentPage = currentPage;

    let perPageOptions = [5, 10, 25, 50, 100];
    this.perPageOptions = perPageOptions;


    
    // Because this will come in as a string 
    let parsedPerPage = parseInt(search[currentPerPageName])

    // Determine if value passed in is a valid option or not.
    let perPagePassedDefault = parsedPerPage !== NaN && 
                                perPageOptions.indexOf(parsedPerPage) > 0 ?
                                parsedPerPage : 
                                perPageOptions[0];


    this.perPageDefault = perPagePassedDefault;


    $scope.perPageChanged = function() {
      let { perPage } = this.pagination;

      // Should not need to parseInt since this should be a NUMBER
      let idx = perPageOptions.indexOf(perPage)
      // Reset to Page 1 when per page changes
      this.pagination.currentPage = 1;

      let val = (idx > 0) ? perPage : null;
      // Start with a copy of the current search object
      let obj = $location.search();
      obj[currentPerPageName] = val;
      obj[currentPageName] = null;
      $location.search(obj)
    }


    // Here we get the UIB pagination directive, but
    //  we are interested in the Angular-Table scope.
    $scope.pageChanged = function() {
      // Get the current scope of the table we are in and
      //  retrieve the new page we are on.
      let cp = parseInt(this.$parent.pagination.currentPage);
      // If page is 1, then clear the url search string
      let page = (cp !== NaN && cp >= 2) ? cp : null;
      // Start with a copy of the current search object
      let obj = $location.search();
      obj[currentPageName] = page;
      $location.search(obj)
    }

    $scope.$on( 'tablesort:sortOrder', (evt, val) => {

      // Check if $emit belongs to this controller.
      if (!evt.targetScope.itemsArrayExpression.match(/^clusterDetailsCtrl/)) return;

      // Start with a copy of the current search object
      let obj = $location.search();
      
      // Overwrite / Append as needed
      obj[currentSortName] = val[0].name;
      // Default order is ASC, so clear it if that is the value
      obj[currentSortOrder] = val[0].order === true ? "DESC" : undefined;

      $location.search(obj);
    });
    /*
    /api/indices/[cluster_name]/_summary"
     - Number of nodes
      - Number of Shardes
    /api/indices/[cluster_name]
     - List Indices
    */
  }

}

export default clusterDetailsController;
