import angular from 'angular';

import numeral from './numeral.filter.js';

const CommonFilters = angular.module('commonFilters', [])
                            .filter({ numeral })
                            .name;

export default CommonFilters;