import template from './node-plugins-table.template.html';
import controller from './node-plugins-table.controller';

const nodePluginsTableComponent = {
    bindings: {
        plugins: '<'
    },
    template,
    controller,
    controllerAs: 'nodePluginsTableCtrl'
};

export default nodePluginsTableComponent;
