import './cluster-aliases.style.scss'

class clusterAliasesController {

    // Imports go here
    constructor($stateParams, ClusterAliases, $filter) {
        'ngInject';

        // Pagination stuff
        this.totalItems = 1;
        this.currentPage = 1;
        this.maxSize = 7;
        this.itemsPerPage = 5;

        this.$filter = $filter;
        this.search = {text: ''}
        this.clusterName = $stateParams.clusterName;
        this.service = ClusterAliases;

        this.service.clusterAliases(this.clusterName,).then((resp) => {
            console.log('--- aliases: ', resp.data.data)
            this.aliases = resp.data.data;
        })

        this.columns = [
            {
                label: 'Index',
                key: 'index_name'
            },
            {
                label: 'Alias',
                key: 'alias'
            }
        ]
    }

    $doCheck() {
        if (!angular.equals(this._data, this.aliases)) {
            this._data = this.aliases;
            this.filterData();
        }
    }

    sortBy(col) {
        if (this._sorter === col.key) {
            if (this._order === 'desc') {
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

    filterData() {
        let _data = [].concat(this._data || []);
        if (this.search.text.length) _data = this.$filter('filter')(_data, this.search.text)
        if (this._sorter) {
            _data = (this.sortReverse) ?
                _.orderBy(_data, this._sorter) :
                _.orderBy(_data, this._sorter).reverse()

        }

        this.totalItems = _data.length;
        _data = _.chunk(_data, this.itemsPerPage);
        this.currentPage = 1;

        this.data = _data;
    }
}

export default clusterAliasesController;
