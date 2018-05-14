import './cluster-indices-deleted.style.scss'

class clusterIndicesDeletedController {

    constructor($stateParams, ClusterIndices, $state, $sce, $filter, Notification) {
        'ngInject';

        // Pagination stuff
        this.totalItems = 1;
        this.currentPage = 1;
        this.maxSize = 7;
        this.itemsPerPage = 5;

        this.$state = $state;
        this.$sce = $sce;
        this.$filter = $filter;
        this.search = {text: ''};
        this.clusterName = $stateParams.clusterName;
        this.service = ClusterIndices;
        this.Notification = Notification;

        this.columns = [
            {
                label: 'Index',
                key: 'index_name'
            },
            {
                label : 'Deleted',
                key : 'deleted'
            }
        ];
        this.search = {text: ''};
        this.filterFn = this.filterFn.bind(this);

        this.fetchData();
    }

    fetchData() {
        this.service.clusterIndicesListDeleted(this.clusterName,).then((resp) => {
            console.log('--- indices_deleted: ', resp.data.data);
            this.indices_deleted = resp.data.data;
        });
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

export default clusterIndicesDeletedController;
