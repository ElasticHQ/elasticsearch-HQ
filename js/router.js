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


$(document).ready(
    function ($) {

        var elasticHQRouter = Backbone.Router.extend({

                routes:{
                    "cluster":"cluster",
                    "nodes":"nodes",
                    "nodes/:nodeId":"nodes",
                    "shutdownNode/:nodeId":"killNode",
                    "showhotthreads/:nodeId":"showhotthreads",
                    "indices":"indices",
                    "optimizeall":"optimizeall",
                    "flushall":"flushall",
                    "clearcacheall":"clearcacheall",
                    "createindex":"createIndex",
                    "deleteindex/:indexId":"deleteIndex",
                    "flushindex/:indexId":"flushIndex",
                    "clearcacheindex/:indexId":"clearCacheIndex",
                    "optimizeindex/:indexId":"optimizeIndex",
                    "refreshindex/:indexId":"refreshIndex",
                    "index/:indexId":"index",
                    "query":"query",
                    "admin":"admin",
                    "admin/action":"admin",
                    "*actions":"defaultRoute"
                },
                cluster:function () {
                    stopAllPollers();

                    var healthModel = cluster.get("clusterHealth");

                    healthModel.fetch({
                        success:function () {

                            // populate clusterstate
                            cluster.refreshClusterState();

                            var polloptions = {delay:10000};
                            clusterHealthPoller = Backbone.Poller.get(healthModel, polloptions);
                            clusterHealthPoller.start();

                            clusterHealthPoller.on('success', function (healthModel) {
                                var clusterView = new ClusterHealthView({el:$("#clusterHealth-loc"), model:healthModel});
                                clusterView.render();

                                cluster.refreshClusterState();

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
                                            var err = 'Unable to Read Node List! ';
                                            console.log('Error! ' + err);
                                            var errModel = new ErrorMessageModel({warningTitle:'Error!', warningMessage:err});
                                            var errorMsgView = new ErrorMessageView({el:$("#error-loc"), model:errModel});
                                            errorMsgView.render();
                                        }
                                    }
                                );
                            });

                            // we render the workspace only once..
                            var clusterView = new ClusterHealthView({model:healthModel});
                            clusterView.renderWorkspace();

                            clusterHealthPoller.on('error', function (healthModel, response) {
                                var err = 'Unable to Connect to Server! Connection broken, or server has gone away. Please reconnect.';
                                console.log('Error! ' + err);
                                var errModel = new ErrorMessageModel({warningTitle:'Error!', warningMessage:err});
                                var errorMsgView = new ErrorMessageView({el:$("#error-loc"), model:errModel});
                                errorMsgView.render();

                                // update cluster button
                                healthModel.attributes.status = 'red';
                                var clusterView = new ClusterHealthView({el:$("#clusterHealth-loc"), model:healthModel});
                                clusterView.render();
                                $("#toolbar").css("visibility", "hidden");

                                // update nodes view.
                                var nodeListView = new NodeListView({el:$("#nodeList-loc"), model:[]});
                                nodeListView.render();

                            });
                        },
                        error:function (model, response) {
                            var err = 'Unable to Connect to Server! ';
                            if (response) {
                                err += 'Received Status Code: ' + response.status + '.';
                                if (response.status == 0) {
                                    err += " A status code of 0, could mean the host is unreacheable or nothing is listening on the given port.";
                                }
                            }
                            console.log('Error! ' + err);
                            var errModel = new ErrorMessageModel({warningTitle:'Error!', warningMessage:err});
                            var errorMsgView = new ErrorMessageView({el:$("#error-loc"), model:errModel});
                            errorMsgView.render();
                        }
                    });
                },
                nodes:function (nodeId) {
                    stopAllPollers();
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
                },
                killNode:function (nodeId) {
                    stopAllPollers();
                    console.log("shutdown for nodeId: " + nodeId);
                    var nodeShutdown = new NodeShutdownModel({nodeId:nodeId, connectionRootURL:cluster.get("connectionRootURL")});
                    nodeShutdown.save();
                    var nodeShutdownView = new NodeShutdownView();
                    nodeShutdownView.render();
                    show_stack_bottomright({type:'info', title:'Tip', text:'Node List will soon refresh and remove the dead node.'});

                },
                showhotthreads:function (nodeId) {
                    var nodeHotThreads = new NodeHotThreadsModel({nodeId:nodeId, connectionRootURL:cluster.get("connectionRootURL")});
                    nodeHotThreads.fetch({
                        success:function () {
                            var nodeHotThreadsView = new NodeHotThreadView({model:nodeHotThreads});
                            nodeHotThreadsView.render();
                        }
                    });
                },
                indices:function () {
                    stopNodePoller();
                    var indexStatusModel = new IndexStatusModel();
                    indexStatusModel.setConnectionRootURL(cluster.get("connectionRootURL"));
                    indexStatusModel.fetch(
                        {
                            success:function () {
                                // need to have a refreshed clusterstate
                                cluster.get("clusterState").fetch({
                                    success:function (model, res) {
                                        var indexListView = new IndexStatusListView({model:indexStatusModel});
                                        indexListView.render();
                                    }});
                            },
                            error:function () {
                                // TODO
                            }
                        }
                    );
                },
                optimizeall:function () {
                    var optimizeAllModel = new OptimizeAllIndex({connectionRootURL:cluster.get("connectionRootURL")});
                    optimizeAllModel.fetch({
                        success:function (model, response) {
                            var str = JSON.stringify(response, undefined, 2); // indentation level = 2
                            var optimizeAllView = new OptimizeAllIndexView({model:str});
                            optimizeAllView.render();
                        },
                        error:function () {
                            // TODO
                        }
                    });
                },
                flushall:function () {
                    var flushAllModel = new FlushAllIndex({connectionRootURL:cluster.get("connectionRootURL")});
                    flushAllModel.fetch({
                        success:function (model, response) {
                            var str = JSON.stringify(response, undefined, 2); // indentation level = 2
                            var flushAllView = new FlushAllIndexView({model:str});
                            flushAllView.render();
                        },
                        error:function () {
                            // TODO
                        }
                    });
                },
                clearcacheall:function () {
                    var clearcacheAllModel = new ClearCacheAllIndex({connectionRootURL:cluster.get("connectionRootURL")});
                    clearcacheAllModel.fetch({
                        success:function (model, response) {
                            var str = JSON.stringify(response, undefined, 2); // indentation level = 2
                            var clearcacheAllView = new ClearCacheAllIndexView({model:str});
                            clearcacheAllView.render();
                        },
                        error:function () {
                            // TODO
                        }
                    });
                },
                createIndex:function () {
                    var createIndexModel = new IndexModel({connectionRootURL:cluster.get("connectionRootURL")});
                    var createIndexView = new CreateIndexView({model:createIndexModel});
                    createIndexView.render();
                },
                deleteIndex:function (indexId) {
                    indexRoute.deleteIndex(indexId);
                },
                clearCacheIndex:function (indexId) {
                    indexRoute.clearCacheIndex(indexId);
                },
                flushIndex:function (indexId) {
                    indexRoute.flushIndex(indexId);
                },
                refreshIndex:function (indexId) {
                    indexRoute.refreshIndex(indexId);
                },
                optimizeIndex:function (indexId) {
                    indexRoute.optimizeIndex(indexId);
                },
                index:function (indexId) {
                    stopNodePoller();
                    var createIndexModel = new IndexModel({connectionRootURL:cluster.get("connectionRootURL"), indexId:indexId});
                    var indexView = new IndexView({model:createIndexModel});
                    indexView.render();
                },
                defaultRoute:function () {
                    stopAllPollers();
                    console.log('defaultRoute');
                }
            })
            ;

        Backbone.history.start();
        router = new elasticHQRouter();
    })
;
