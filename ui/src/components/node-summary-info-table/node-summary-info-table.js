import angular from 'angular';
import nodeSummaryInfoTable from './node-summary-info-table.component';

export default angular.module('eshq.nodeSummaryInfoTable', [])
  .component('eshqNodeSummaryInfoTable', nodeSummaryInfoTable)
  .name;
