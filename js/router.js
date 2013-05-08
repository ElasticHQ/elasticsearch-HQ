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

var nodePoller;
$(document).ready(
    function ($) {

        var elasticHQRouter = Backbone.Router.extend({

            routes:{
                "cluster":"cluster",
                "nodes":"nodes",
                "nodes/:nodeId":"nodes",
                "indices":"indices",
                "query":"query",
                "admin":"admin",
                "admin/action":"admin",
                "*actions":"defaultRoute"
            },
            cluster:function () {
                cleanDefaults();
                console.log('cluster route');
            },
            nodes:function (nodeId) {
                cleanDefaults();
                console.log("route nodeId: " + nodeId);

                var nodeInfo = new NodeInfoModel({nodeId:nodeId, connectionRootURL:cluster.get("connectionRootURL")});

                var nodeInfoView = new NodeInfoView({model:nodeInfo});

                cluster.set({monitorNode:nodeInfo});

                var polloptions = {delay:5000};
                nodePoller = Backbone.Poller.get(nodeInfo, polloptions);
                nodePoller.start();
                nodePoller.on('success', function (nodeInfo) {
                    console.log('another successful fetch!');
                    nodeInfoView.render();
                });

                /*
                 poller.on('complete', function (nodeInfo) {
                 console.log('hurray! we are done!');
                 });
                 */
                nodePoller.on('error', function (nodeInfo) {
                    console.log('oops! something went wrong');
                });

            },
            defaultRoute:function () {
                cleanDefaults();
                console.log('defaultRoute');
            }
        });

        var router = new elasticHQRouter();

        Backbone.history.start();

    });

var cleanDefaults = function () {
    if (nodePoller != undefined) {
        nodePoller.stop();
    }
}