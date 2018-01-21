
import topNav from './top-nav/top-nav';
import clusterSummary from './cluster-summary/cluster-summary';
import clusterNavigation from './cluster-navigation/cluster-navigation';
import indicesTable from './indices-table/indices-table';

// Components for Cluster > Index Details
import indexAdministrationTabContent from './index-administration-tab-content/index-administration-tab-content';
import indexMetricsTabContent from './index-metrics-tab-content/index-metrics-tab-content';
import indexMetricDocs from './index-metric-docs/index-metric-docs';
import indexMetricHealth from './index-metric-health/index-metric-health';
import indexMetricGet from './index-metric-get/index-metric-get'
import indexMetricSearch from './index-metric-search/index-metric-search'
import indexMetricIndex from './index-metric-index/index-metric-index'
import indexMetricQCache from './index-metric-querycache/index-metric-querycache'
import indexMetricOps from './index-metric-ops/index-metric-ops'
import indexShardsTabContent from './index-shards-tab-content/index-shards-tab-content';
import indexAliasesTabContent from './index-aliases-tab-content/index-aliases-tab-content';
import indexMappingsTabContent from './index-mappings-tab-content/index-mappings-tab-content';

// Nodes components
import nodeFsInfoTable from './node-fs-info-table/node-fs-info-table';
import nodeProcessTable from './node-process-table/node-process-table';

const CommonComponents = angular.module('components', [
  clusterSummary,
  clusterNavigation,
  indicesTable,
  indexAdministrationTabContent,
  indexMetricsTabContent,
  indexShardsTabContent,
  indexAliasesTabContent,
  indexMappingsTabContent,
  indexMetricDocs,
  indexMetricHealth,
  indexMetricGet,
  indexMetricIndex,
  indexMetricQCache,
  indexMetricOps,
  indexMetricSearch,
  nodeFsInfoTable,
  nodeProcessTable,
  topNav,
]).name;

export default CommonComponents;