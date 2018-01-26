import './index-aliases-tab-content.style.scss'

class indexAliasesTabContentController {

    constructor($stateParams, ClusterAliases) {
                'ngInject';

        this.clusterName = $stateParams.clusterName;
        this.indexName = $stateParams.indexName;

        this.ClusterAliases = ClusterAliases;
        console.log("aaaaaa %O", this.ClusterAliases);
    }

    deleteAlias(alias_name) {
        this.fetching = true;
        this.ClusterAliases.clusterAliasesDelete(this.clusterName, this.indexName, alias_name).then((resp) => {
            console.log('------ response: ', resp.data)
        }).finally(() => this.fetching = false)
    }

}

export default indexAliasesTabContentController;
