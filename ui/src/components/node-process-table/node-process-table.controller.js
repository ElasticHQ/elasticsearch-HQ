import './node-process-table.style.scss';

import moment from 'moment';

class nodeProcessTableController {
    constructor() {
        'ngInject';
    }

    $doCheck() {
        if (!angular.equals(this._process, this.process)){
            this._process = this.process;
        }
    }

    renderTimeWords(val) {
        return moment.utc(+moment.utc() - val).fromNow();
    }
}

export default nodeProcessTableController;
