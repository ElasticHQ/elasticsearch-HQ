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

var router;

var nodePoller;
var clusterHealthPoller;
$(document).ready(
    function ($) {

        var elasticHQRouter = Backbone.Router.extend({

            routes:{
                "cluster":"cluster",
                "nodes":"nodes",
                "nodes/:nodeId":"nodes",
                "shutdownNode/:nodeId":"killNode",
                "indices":"indices",
                "query":"query",
                "admin":"admin",
                "admin/action":"admin",
                "*actions":"defaultRoute"
            },
            cluster:function () {
                cleanDefaults();

                var healthModel = cluster.get("clusterHealth");
                healthModel.fetch({
                    success:function () {

                        var polloptions = {delay:10000};
                        clusterHealthPoller = Backbone.Poller.get(healthModel, polloptions);
                        clusterHealthPoller.start();

                        clusterHealthPoller.on('success', function (healthModel) {
                            var clusterView = new ClusterHealthView({el:$("#clusterHealth-loc"), model:healthModel});
                            clusterView.render();
                            $("#toolbar").css("visibility", "visible");

                            var nodeList = cluster.get("nodeList");
                            nodeList.fetch(
                                {
                                    success:function (model, response) {
                                        console.log('Node List retrieved');
                                        var nodeListView = new NodeListView({el:$("#nodeList-loc"), model:nodeList});
                                        nodeListView.render();
                                    },
                                    error:function (model, response, options) {
                                        // TODO
                                    }
                                }
                            );
                        });

                        clusterHealthPoller.on('error', function (healthModel) {
                            var err = 'Unable to Connect to Server! ';
                            console.log('Error! ' + err);
                            var errModel = new ErrorMessageModel({warningTitle:'Error!', warningMessage:err});
                            var errorMsgView = new ErrorMessageView({el:$("#error-loc"), model:errModel});
                            errorMsgView.render();
                        });
                    },
                    error:function (model, response) {
                        var err = 'Unable to Connect to Server! ';
                        if (response) {
                            err += 'Received Status Code: ' + response.status;
                        }
                        console.log('Error! ' + err);
                        var errModel = new ErrorMessageModel({warningTitle:'Error!', warningMessage:err});
                        var errorMsgView = new ErrorMessageView({el:$("#error-loc"), model:errModel});
                        errorMsgView.render();
                    }
                });
            },
            nodes:function (nodeId) {
                cleanDefaults();
                console.log("route nodeId: " + nodeId);

                var nodeStat = new NodeStatsModel({nodeId:nodeId, connectionRootURL:cluster.get("connectionRootURL")});
                var nodeInfo = new NodeInfoModel({nodeId:nodeId, connectionRootURL:cluster.get("connectionRootURL")});
                nodeInfo.fetch(
                    {
                        success:function (model, response) {
                            var nodeInfoView = new NodeStatView({model:nodeStat, infoModel:nodeInfo});

                            cluster.set({nodeStats:nodeStat, nodeInfo:nodeInfo});

                            var polloptions = {delay:5000};
                            nodePoller = Backbone.Poller.get(nodeStat, polloptions);
                            nodePoller.start();
                            nodePoller.on('success', function (nodeInfo) {
                                console.log('another successful fetch!');
                                nodeInfoView.render();
                                ajaxloading.hide();
                            });

                            /*
                             poller.on('complete', function (nodeStat) {
                             console.log('hurray! we are done!');
                             });
                             */
                            nodePoller.on('error', function (nodeInfo) {
                                console.log('oops! something went wrong');
                            });
                        },
                        error:function () {
                            // TODO
                        }
                    }
                );
            },
            killNode:function (nodeId) {
                cleanDefaults();
                console.log("shutdown for nodeId: " + nodeId);
                var nodeShutdown = new NodeShutdownModel({nodeId:nodeId, connectionRootURL:cluster.get("connectionRootURL")});
                nodeShutdown.save();
                var nodeShutdownView = new NodeShutdownView();
                nodeShutdownView.render();
            },
            defaultRoute:function () {
                cleanDefaults();
                console.log('defaultRoute');
            }
        });

        Backbone.history.start();
        router = new elasticHQRouter();
    });

var cleanDefaults = function () {

    if (nodePoller != undefined) {
        nodePoller.stop();
    }
    if (clusterHealthPoller != undefined) {
        clusterHealthPoller.stop();
    }
}