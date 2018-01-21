

// node modules
import 'babel-polyfill';
import angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import uiBootstrap from 'angular-ui-bootstrap';
import hljs from 'angular-highlightjs';

// Routes
import config from './app.config.js';
import CommonComponents from './components/common-components';
import CommonContainers from './containers/common-containers';
import CommonFactories from './factories/common-factories';
import CommonFilters from './filters/common-filters';
import CommonServices from './services/common-services';

// Main Layout
import './styles/base.scss';


angular.module('eshq',[
    uiRouter,
    uiBootstrap,
    CommonComponents,
    CommonContainers,
    CommonFactories,
    CommonFilters,
    CommonServices,
    hljs
])
.config(config)