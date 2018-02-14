import angular from 'angular';

import numeral from './numeral.filter.js';
import moment from './moment.filter';

const CommonFilters = angular.module('commonFilters', [])
                            .filter({ numeral })
                            .filter({ moment })
                            .name;

export default CommonFilters;