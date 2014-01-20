/*
 Copyright 2013 Roy Russo

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.

 Latest Builds: https://github.com/royrusso/elasticsearch-HQ
 */

var nodeRoute = {};

nodeRoute.selectedDiagnoseNodeIDs = [];

nodeRoute.selectDiagnoseNodes = function (nodeList) {
    if (nodeList != undefined && nodeList.length > 0) {
        // pull the first X nodes for selection
        var maxNodes = settingsModel.get('settings').nodeDiagnosticsMax;
        for (var i = 0; i < maxNodes; i++) {
            if (nodeList.models[i]) {
                nodeRoute.selectedDiagnoseNodeIDs.push(nodeList.models[i].id);
            }
        }
    }
};

nodeRoute.diagnoseNodes = function () {

    // only show the first X nodes. Large node lists can cause browser to stall, so we limit what we call the cluster for.
    var nodeList = cluster.get("nodeList");
    if (nodeRoute.selectedDiagnoseNodeIDs.length == 0) {
        nodeRoute.selectDiagnoseNodes(nodeList);
    }

    var nodeInfoListModel = new NodeInfoListModelFactory().create(nodeRoute.selectedDiagnoseNodeIDs);
    var nodeStatsListModel = new NodeStatsListModelFactory().create(nodeRoute.selectedDiagnoseNodeIDs);
    nodeInfoListModel.fetch({
        success:function (model, response) {
            var nodeListView = new NodeStatsListView({infoModel:nodeInfoListModel, model:nodeStatsListModel});

            var polloptions = {delay:settingsModel.get('settings').poller.nodeDiagnostics};
            nodeDiagnosticsPoller = Backbone.Poller.get(nodeStatsListModel, polloptions);
            nodeDiagnosticsPoller.start();
            nodeDiagnosticsPoller.on('success', function (nodeInfoListModel) {
                console.log('another successful fetch!');
                nodeListView.render();
                ajaxloading.hide();
            });
        }
    });
};

/**
 * persistence for nodeInfoView = used mainly on manual refresh
 *
 * @type {Object}
 */
nodeRoute.nodeView = {};

nodeRoute.nodeInfo = function (nodeId) {
    //

    console.log("route nodeId: " + nodeId);

    var nodeStat = new NodeStatsModelFactory().create(nodeId);//new NodeStatsModel({nodeId:nodeId, connectionRootURL:cluster.get("connectionRootURL")});
    var nodeInfo = new NodeInfoModelFactory().create(nodeId);
    nodeInfo.fetch(
        {
            success:function (model, response) {
                var nodeInfoView = new NodeStatsViewFactory().create(nodeStat, nodeInfo);

                cluster.set({nodeStats:nodeStat, nodeInfo:nodeInfo});

                var polloptions = {delay:settingsModel.get('settings').poller.node};
                nodePoller = Backbone.Poller.get(nodeStat, polloptions);
                nodePoller.start();
                nodePoller.on('success', function (nodeInfo) {
                    console.log('another successful fetch!');
                    nodeInfoView.render();
                    nodeRoute.nodeView = nodeInfoView;
                    ajaxloading.hide();
                });

                /*
                 poller.on('complete', function (nodeStat) {
                 console.log('hurray! we are done!');
                 });
                 */
                nodePoller.on('error', function (nodeInfo) {
                    var err = 'Unable to Read Node Information! ';
                    console.log('Error! ' + err);
                    var errModel = new ErrorMessageModel({warningTitle:'Error!', warningMessage:err});
                    var errorMsgView = new ErrorMessageView({el:$("#error-loc"), model:errModel});
                    errorMsgView.render();
                });
            },
            error:function (model, response, options) {
                var err = 'Unable to Read Node Information! ';
                console.log('Error! ' + err);
                var errModel = new ErrorMessageModel({warningTitle:'Error!', warningMessage:err});
                var errorMsgView = new ErrorMessageView({el:$("#error-loc"), model:errModel});
                errorMsgView.render();
            }
        }
    );
};

nodeRoute.refreshNodeInfo = function (nodeId) {
    var nodeStat = cluster.get("nodeStats");//nodeInfo:nodeInfo});
    var nodeInfo = cluster.get("nodeInfo");

    $.when(nodeInfo.fetch(), nodeStat.fetch())
        .done(function () {
            cluster.set({nodeStats:nodeStat, nodeInfo:nodeInfo});
            var nodeInfoView = nodeRoute.nodeView; //new NodeStatView({model:nodeStat, infoModel:nodeInfo});
            nodeInfoView.render();
            ajaxloading.hide();
        });
};