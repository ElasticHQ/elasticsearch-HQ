import './indices-table.style.scss';

import _ from 'lodash';
import numeral from 'numeral';

let currentPageName = "indicesTableCurrentPage";
let currentPerPageName = "indicesTablePerPage"
let currentSortName = "indicesTableSortedBy";
let currentSortOrder = "indicesTableSortOrder";


class indicesTableController {
    constructor($stateParams, $state, $sce, $filter, $scope, $location) {
        'ngInject';

        this.$sce = $sce;
        this.$filter = $filter;

        this.clusterName = $stateParams.clusterName;
        this.$state = $state;

        // Pagination stuff
        this.totalItems = 1;
        this.currentPage = 1;
        this.maxSize = 7;
        this.itemsPerPage = 10;

        const formatNum = '0[.][0][0]a';
        const formatByt = '0[.][0][0] b'; 

        this.search = {text: ''}

        this.filterFn = this.filterFn.bind(this);

        this.columns = [
            {
                label: 'Index',
                key: 'index_name'
            },
            {
                label: 'Docs',
                key: 'docs',
                formatter: formatNum
            },
            {
                label: 'Shards',
                key: 'settings.number_of_shards',
                formatter: formatNum
            },
            {
                label: 'Replicas',
                key: 'settings.number_of_replicas',
                formatter: formatNum
            },
            {
                label: 'Size',
                key: 'size_in_bytes',
                formatter: formatByt
            },
            {
                label: 'Cache Size',
                key: 'fielddata.memory_size_in_bytes',
                formatter: formatByt
            },
        ]

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
            $location.search(obj);
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
            if (!evt.targetScope.itemsArrayExpression.match(/^indicesTable/)) return;


            // Start with a copy of the current search object
            let obj = $location.search();
            
            // Overwrite / Append as needed
            obj[currentSortName] = val[0].name;
            // Default order is ASC, so clear it if that is the value
            obj[currentSortOrder] = val[0].order === true ? "DESC" : undefined;

            $location.search(obj);
        });

        this.hasLoaded = true;
    }

    $doCheck() {
        if(!angular.equals(this._data, this.indices)){
            this._data = this.indices;
            this.filterData();
        }
    }

    renderCell(obj, col){
        // console.log('---- obj, col', obj, col)
        let val = _.get(obj, col.key);
        if (col.key === 'index_name') {
            let url = this.$state.href("clusterIndiceDetails", {clusterName: this.clusterName, indexName: val})
            let str = '<a href="' + url + '">' + val + '</a>';
            return this.$sce.trustAsHtml(str);
        }
        if (!col.formatter) return this.$sce.trustAsHtml(val);
        return this.$sce.trustAsHtml(numeral(val).format(col.formatter));
      }
    
      sortBy(col){
        if (this._sorter === col.key){
          if (this._order === 'desc'){
            // Reset and return original array
            this._sorter = undefined;
            this.sortReverse = undefined;
            return this.filterData();
          } else {
            // Default to Asc
            this.sortReverse = true;
          }
        } else {
          this._sorter = col.key;
          this.sortReverse = false;
        }
        this.filterData();
      }
    
      filterData(){
        let _data = [].concat(this._data || []);
        if (this.search.text.length) _data = this.$filter('filter')(_data, this.search.text)
        if (this._sorter){
          _data = (this.sortReverse) ?
                              _.orderBy(_data, this._sorter) :
                              _.orderBy(_data, this._sorter).reverse()
    
        }
    
        this.totalItems = _data.length;
        // _data = _.chunk(_data, this.itemsPerPage);
        if (this.hasLoaded === true) {
            // DO NOT RESET PAGE because we might be 
            //  pre-loading from a desired page
            this.hasLoaded = false;
        } else {
            this.currentPage = 1;
        }
        
        this.data = _data;
      }

      filterFn(item) {
          let filtered = (this.search.text && this.search.text.length) ?
                            this.$filter('filter')([item], this.search.text).length :
                            1;
          return !!filtered;
      }
}

export default indicesTableController;
