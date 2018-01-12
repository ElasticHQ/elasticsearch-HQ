
import topNav from './top-nav/top-nav';
import clusterSummary from './cluster-summary/cluster-summary';
import indicieCard from './indicie-card/indicie-card';

const CommonComponents = angular.module('components', [
  clusterSummary,
  indicieCard,
  topNav,
]).name;

export default CommonComponents;