import template from './repositories-table.template.html';
import controller from './repositories-table.controller';

const repositoriesTableComponent = {
    bindings: {
        repositories: '='
    },
    template,
    controller,
    controllerAs: 'repositoriesTableCtrl'
};

export default repositoriesTableComponent;
