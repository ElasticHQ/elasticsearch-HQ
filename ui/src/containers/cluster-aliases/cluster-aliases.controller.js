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
    }

    renderCell(obj, index_name) {
        let url = this.$state.href("clusterIndiceDetails", {clusterName: this.clusterName, index_name: index_name})
        console.log('state ' + this.$state);
        //console.log('u' + url);
        let str = '<a href="' + url + '">' + index_name + '</a>';
        return this.$sce.trustAsHtml(str);
    }
}

export default clusterAliasesController;
