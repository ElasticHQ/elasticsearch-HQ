import './home.style.scss';

const fooImage = require('../../images/foo.gif')

class homeController {
    constructor() {
        'ngInject';
        
        this.imageSrc = fooImage;
    }
}

export default homeController;