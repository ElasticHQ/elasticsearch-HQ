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

}

export default clusterAliasesController;
