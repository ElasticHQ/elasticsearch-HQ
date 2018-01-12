import angular from 'angular';

import homeController from './home/home.controller';

const CommonContainers = angular.module('commonContainers', [])
                            .controller('homeController', homeController)
                            .name;

export default CommonContainers;