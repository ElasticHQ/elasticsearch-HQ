

// node modules
import 'babel-polyfill';
import angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import uiBootstrap from 'angular-ui-bootstrap';

// Routes
import config from './app.config.js';
import CommonComponents from './components/common-components';
import CommonContainers from './containers/common-containers';
import CommonFactories from './factories/common-factories';
import CommonServices from './services/common-services';

// Main Layout
import './styles/base.scss';


angular.module('eshq',[
    uiRouter,
    uiBootstrap,
    CommonComponents,
    CommonContainers,
    CommonFactories,
    CommonServices
])
.config(config)