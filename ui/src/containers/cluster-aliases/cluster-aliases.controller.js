import './cluster-aliases.style.scss'

class clusterAliasesController {

    // Imports go here
    //constructor($stateParams, $state, $sce, $filter)
    //constructor($stateParams, ClusterAliases, $filter, $sce, $state) {
    constructor($stateParams, ClusterAliases, $state, $sce, $filter) {
        'ngInject';

        // Pagination stuff
        this.totalItems = 1;
        this.currentPage = 1;
        this.maxSize = 7;
        this.itemsPerPage = 5;

        this.$state = $state;
        this.$sce = $sce;
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
        this.search = {text: ''}
        this.filterFn = this.filterFn.bind(this);
    }

    $doCheck() {
        if (!angular.equals(this._data, this.aliases)) {
            this._data = this.aliases;
            this.filterData();
        }
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

export default clusterAliasesController;
