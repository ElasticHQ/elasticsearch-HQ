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
                console.log('cluster route');
            },
            nodes:function (nodeId) {
                console.log("route nodeId: " + nodeId);
                var nodeInfo = new NodeInfoModel();
            },
            defaultRoute:function () {
                console.log('defaultRoute');
            }
        });

        var router = new elasticHQRouter();

        Backbone.history.start();

    });