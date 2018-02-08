import './cluster-indices.style.scss';

import createIndexModal from './create-index-modal.html';

class clusterIndicesController {

    // Imports go here
    constructor($stateParams, ClusterIndices, QueuedFactory, $scope,
                Notification, $uibModal) {
        'ngInject';

        this.ClusterIndices = ClusterIndices;
        this.clusterName = $stateParams.clusterName;
        this.Notification = Notification;
        this.$uibModal = $uibModal;

        // Import QueuedFactory because indicies takes time and 
        //   should be cancelled if not returned before leaving page.
        this.que = QueuedFactory;

        // Fetch the data
        this.fetchingIndices = false;

        // Because on new versions of UI-ROUTER
        //  Controllers are not "Destroyed" when re-routing
        //  But $scope is.
        // Could clean up in the future and have the CONFIG
        //  user only components vs containers.
        $scope.$on('$destroy', () => {
            console.log('--- destroy called: ', this.request)
            if (this.request) this.que.cancel(this.request);
        })

        // INIT Get all Indicies
        this.fetchIndicies();

    }

    fetchIndicies() {
        this.fetchingIndices = true;

        this.request = this.ClusterIndices.clusterInidices(this.clusterName)

        // #FIXME
        //  https://github.com/angular/angular.js/issues/15607
        //  Canceling the request is creating a new promise for the FINALLY Block
        //  causing a second error
        this.request.then((resp) => {
            console.log('------ inidicies: ', resp.data)
            this.indices = resp.data.data.map((item) => {
                if (item.settings) {
                    if (item.settings.number_of_replicas) item.settings.number_of_replicas = parseInt(item.settings.number_of_replicas)
                    if (item.settings.number_of_shards) item.settings.number_of_shards = parseInt(item.settings.number_of_shards)
                }
                return item;
            });


        }).catch((err) => {
            console.log('---- err: ', err);
        }).finally(() => {
            console.log('---- done fetching')
            this.request = undefined;
            this.fetchingIndices = false;
        });
    }

    clearCache() {
        this.ClusterIndices.clusterIndicesClearCache(this.clusterName).then((resp) => {
            this.Notification.success({message: `Cache clear operation triggered.`, delay: 3000});
        }, (err) => {
            this.Notification.error({message: 'Error in operation!'});
            console.log('---- get clusters error: ', err)
        })
    }

    flushCache() {
        this.fetching = true;
        this.ClusterIndices.clusterIndicesFlush(this.clusterName).then((resp) => {
            this.Notification.success({message: `Cache flush operation triggered.`, delay: 3000});
        }, (err) => {
            this.Notification.error({message: 'Error in operation!'});
            console.log('---- get clusters error: ', err)
        }).finally(() => this.fetching = false)
    }

    refreshIndex() {
        this.fetching = true;
        this.ClusterIndices.clusterIndicesRefresh(this.clusterName).then((resp) => {
            this.Notification.success({message: `Index refresh operation triggered.`, delay: 3000});
        }, (err) => {
            this.Notification.error({message: 'Error in operation!'});
            console.log('---- get clusters error: ', err)
        }).finally(() => this.fetching = false)
    }

    forceMergeIndex() {
        this.fetching = true;
        this.ClusterIndices.clusterIndicesForceMerge(this.clusterName).then((resp) => {
            this.Notification.success({message: `Segment merging operation triggered.`, delay: 3000});
        }, (err) => {
            this.Notification.error({message: 'Error in operation!'});
            console.log('---- get clusters error: ', err)
        }).finally(() => this.fetching = false)
    }

    expungeDeleted() {
        this.fetching = true;
        this.ClusterIndices.clusterIndicesExpungeDeleted(this.clusterName).then((resp) => {
            this.Notification.success({message: `Expunge Deleted operation triggered.`, delay: 3000});
        }, (err) => {
            this.Notification.error({message: 'Error in operation!'});
            console.log('---- get clusters error: ', err)
        }).finally(() => this.fetching = false)
    }

    createIndex() {
        const modalInstance = this.$uibModal.open({
            template: createIndexModal,
            controller: ($scope, $uibModalInstance, clusterName) => {
                'ngInject';

                // After you pass in the resolver, below, attache it for reference
                $scope.clusterName = clusterName;
                $scope.disabled = false;
                $scope.$uibModalInstance = $uibModalInstance;

                $scope.formData = {settings: {}};
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
                },
            }

        });

        // Only when user clicks save, do we proceed
        modalInstance.result.then((formData) => {
            // Logic for Creating Index goes here.
            console.log('==== form data: ', formData);

            let {settings} = formData;

            this.fetching = true;
            this.ClusterIndices.clusterIndexCreate(this.clusterName, formData.index_name, {settings: settings}).then((resp) => {
                this.fetchIndicies();
            }, (err) => {
                console.log('---- err: ', err)
            }).finally(() =>
                this.fetching = false
            );

            this.Notification.success({message: `Index created.`, delay: 3000});

        }, (err) => {
            console.log('Modal dismissed at: ' + new Date());
        });
    }

}

export default clusterIndicesController;
