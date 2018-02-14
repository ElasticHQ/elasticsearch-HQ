import template from './node-jvm-stats-table.template.html';
import controller from './node-jvm-stats-table.controller';

const nodeJvmStatsTableComponent = {
  bindings: {
    jvm: '<',
    stats : '<'
  },    
  template,
  controller,
  controllerAs: 'nodeJvmStatsTableCtrl'
};

export default nodeJvmStatsTableComponent;
