import './index-aliases-tab-content.style.scss'

import createAliasModal from './create-alias-modal.html';

class indexAliasesTabContentController {

    constructor($stateParams, ClusterAliases, $uibModal) {
        'ngInject';

        this.clusterName = $stateParams.clusterName;
        this.indexName = $stateParams.indexName;
        this.$uibModal = $uibModal;
        this.ClusterAliases = ClusterAliases;
        console.log("aaaaaa %O", this.ClusterAliases);
    }

    deleteAlias(alias_name) {
        this.fetching = true;
        this.ClusterAliases.clusterAliasesDelete(this.clusterName, this.indexName, alias_name).then((resp) => {
            console.log('------ response: ', resp.data)
        }).finally(() => this.fetching = false)
    }

    createAlias() {
        const modalInstance = this.$uibModal.open({
            template: createAliasModal,
            controller: ($scope, $uibModalInstance, clusterName, indexName) => {
                'ngInject';

                // After you pass in the resolver, below, attache it for reference
                $scope.clusterName = clusterName;
                $scope.indexName = indexName;
                $scope.disabled = false;
                $scope.$uibModalInstance = $uibModalInstance;

                $scope.formData = {};
                $scope.cancel = () => {
                    $scope.$uibModalInstance.dismiss('close');
                };

                // This is what gets returned in the end
                $scope.save = () => {
                    //  We could also put the logic to send Create here
                    //  so if there is a failure, we still have the modal
                    //  open and user can correct if possible.
                    $scope.$uibModalInstance.close($scope.formData);
                };

            },
            resolve: {
                // How you pass info into the Modal
                clusterName: () => {
                    return this.clusterName;
                }, indexName: () => {
                    return this.indexName;
                },
            }

        });

        // Only when user clicks save, do we proceed
        modalInstance.result.then((formData) => {
            // Logic for Creating Index goes here.
            console.log('==== form data: ', formData);

            this.aliasName = formData.name;
            this.ClusterAliases.clusterAliasesCreate(this.clusterName, this.indexName, this.aliasName);

            // TODO: refresh alias screen

        }, (err) => {
            console.log('Modal dismissed at: ' + new Date());
        });
    }
}

export default indexAliasesTabContentController;
