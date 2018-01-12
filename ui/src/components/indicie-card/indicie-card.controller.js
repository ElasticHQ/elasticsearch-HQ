import './indicie-card.style.scss';

import numeraljs from 'numeraljs';

class indicieCardController {
    constructor() {
        'ngInject';
        console.log('--- this: ', this)
    }

    docs() {
        return numeraljs(this.indexInfo.docs).format('0[.][0][0]a')
    }

    bytes() {
        return numeraljs(this.indexInfo.size_in_bytes).format('0[.][0][0]b')
    }

    replicas() {
        return numeraljs(this.indexInfo.settings.number_of_replicas).format('0[.][0][0]a')
    }

    shards() {
        return numeraljs(this.indexInfo.settings.number_of_shards).format('0[.][0][0]a')
    }
}

export default indicieCardController;
