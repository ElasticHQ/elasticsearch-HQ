import './top-nav.style.scss'

class topNavController {
    constructor($state, $transitions, $location) {
        'ngInject';

        // Get URL to determin if ROOT or not
        this.$location = $location;

        this.seeIfNotRoot();

        // Function call to 
        $transitions.onSuccess({}, (trans) => {
            this.seeIfNotRoot();
        });
    }

    seeIfNotRoot(){
        this.isNotRoot = this.$location.$$path !== '/';
    }

    
}

export default topNavController;
