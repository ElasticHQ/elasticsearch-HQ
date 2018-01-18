
import topNav from './top-nav/top-nav';
import clusterSummary from './cluster-summary/cluster-summary';
import clusterNavigation from './cluster-navigation/cluster-navigation';
import indicesTable from './indices-table/indices-table';

// Components for Cluster > Index Details
import indexMetricsTabContent from './index-metrics-tab-content/index-metrics-tab-content';
import indexMetricDocs from './index-metric-docs/index-metric-docs';
import indexMetricHealth from './index-metric-health/index-metric-health';

const CommonComponents = angular.module('components', [
  clusterSummary,
  clusterNavigation,
  indicesTable,
  indexMetricsTabContent,
  indexShardsTabContent,
  indexMetricDocs,
  indexMetricGet,
  indexMetricHealth,
  topNav,
]).name;

export default CommonComponents;