import './rest-api.style.scss'

class restApiController {

    // Imports go here
    constructor($stateParams) {
        'ngInject';
        this.clusterName = $stateParams.clusterName;
    }
}

export default restApiController;
