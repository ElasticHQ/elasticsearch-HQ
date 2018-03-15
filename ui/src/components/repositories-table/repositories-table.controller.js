import './repositories-table.style.scss'

import _ from 'lodash';
import numeral from 'numeral';

class repositoriesTableController {
    constructor($stateParams, $state, $sce, $filter) {
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

        this.search = {text: ''};

        this.filterFn = this.filterFn.bind(this);

        this.columns = [
            {
                label: 'Repository',
                key: 'repository_name'
            },
            {
                label: 'Type',
                key: 'repository_type'
            },
        ]
    }

    $doCheck() {
        if(!angular.equals(this._data, this.repositories)){
            this._data = this.repositories;
            this.filterData();
        }
    }

    renderCell(obj, col){
        // console.log('---- obj, col', obj, col)
        let val = _.get(obj, col.key);
        if (col.key === 'repository_name') {
            let url = this.$state.href("clusterSnapshotsDetails", {clusterName: this.clusterName, repositoryName: val})
            let str = '<a href="' + url + '">' + val + '</a>';
            console.log(val)
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
        this.currentPage = 1;

        this.data = _data;
      }

      filterFn(item) {
          let filtered = (this.search.text && this.search.text.length) ?
                            this.$filter('filter')([item], this.search.text).length :
                            1;
          return !!filtered;
      }
}

export default repositoriesTableController;
