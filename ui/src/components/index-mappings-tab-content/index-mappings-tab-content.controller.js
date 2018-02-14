import './index-mappings-tab-content.style.scss';
// CSS for Highlighting
import 'highlight.js/styles/atom-one-dark.css';

class indexMappingsTabContentController {
    constructor() {
        'ngInject';
    }

    $doCheck() {
        if (!angular.equals(this._mappings, this.mappings)) {
            this._mappings = this.mappings;
            // Only convert when something changes
            this._toRender = JSON.stringify(this._mappings, null, 2);
        }
    }
}

export default indexMappingsTabContentController;
