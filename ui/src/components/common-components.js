
import topNav from './top-nav/top-nav';
import footer from './footer/footer';
import clustersButton from './clusters-button/clusters-button';

// Components for Settings
import clusters from './clusters/clusters';

//
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
import nodeSummaryInfoTable from './node-summary-info-table/node-summary-info-table';
import nodeFsInfoTable from './node-fs-info-table/node-fs-info-table';
import nodeProcessTable from './node-process-table/node-process-table';
import nodeOsInfoTable from './node-os-info-table/node-os-info-table';
import nodeJVMStatsTable from './node-jvm-stats-table/node-jvm-stats-table';
import nodeDiagnosticsWrapper from './node-diagnostics-wrapper/node-diagnostics-wrapper';


// Editors
import apiEndpoints from './api-endpoints/api-endpoints';

const CommonComponents = angular.module('components', [
  apiEndpoints,
  clusters,
  clusterSummary,
  clusterNavigation,
  clustersButton,
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
  footer,
  nodeDiagnosticsWrapper,
  nodeSummaryInfoTable,
  nodeFsInfoTable,
  nodeProcessTable,
  nodeOsInfoTable,
  nodeJVMStatsTable,
  topNav,
]).name;

export default CommonComponents;