
import topNav from './top-nav/top-nav';
import indicieCard from './indicie-card/indicie-card';

const CommonComponents = angular.module('components', [
  indicieCard,
  topNav,
]).name;

export default CommonComponents;