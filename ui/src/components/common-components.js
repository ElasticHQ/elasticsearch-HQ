
import topNav from './top-nav/top-nav';

console.log('------ topNav: ', topNav)
const CommonComponents = angular.module('components', [
  topNav,
]).name;

export default CommonComponents;