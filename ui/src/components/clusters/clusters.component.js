import template from './clusters.template.html';
import controller from './clusters.controller';

const clustersComponent = {
    template,
    controller,
    controllerAs: 'clustersCtrl',
    fetchFn: '&?'
};

export default clustersComponent;
