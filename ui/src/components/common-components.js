
import topNav from './top-nav/top-nav';
import clusterSummary from './cluster-summary/cluster-summary';
import clusterNavigation from './cluster-navigation/cluster-navigation';
import indicesTable from './indices-table/indices-table';

// Components for Cluster > Index Details
import indexAdministrationTabContent from './index-administration-tab-content/index-administration-tab-content';
import indexMetricsTabContent from './index-metrics-tab-content/index-metrics-tab-content';
import indexMetricDocs from './index-metric-docs/index-metric-docs';
import indexMetricHealth from './index-metric-health/index-metric-health';
import indexShardsTabContent from './index-shards-tab-content/index-shards-tab-content'
import indexMetricGet from './index-metric-get/index-metric-get'
import indexMetricSearch from './index-metric-get/index-metric-search'
import indexShardsTabContent from './index-shards-tab-content/index-shards-tab-content';
import indexMetricGet from './index-metric-get/index-metric-get';

const CommonComponents = angular.module('components', [
  clusterSummary,
  clusterNavigation,
  indicesTable,
  indexAdministrationTabContent,
  indexMetricsTabContent,
  indexShardsTabContent,
  indexMetricDocs,
  indexMetricHealth,
  indexMetricGet,
  indexMetricSearch,
  topNav,
]).name;

export default CommonComponents;