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
                "refreshCluster":"refreshCluster",
                "nodes":"nodes",
                "nodes/:nodeId":"nodes",
                "nodediagnostics":"nodeDiagnostics",
                "refreshNodeDiagnostics":"refreshNodeDiagnostics",
                "shutdownNode/:nodeId":"killNode",
                "showhotthreads/:nodeId":"showhotthreads",
                "indices":"indices",
                "refreshindices":"refreshIndices",
                "optimizeall":"optimizeall",
                "flushall":"flushall",
                "clearcacheall":"clearcacheall",
                "refreshall":"refreshAll",
                "createindex":"createIndex",
                "deleteindex/:indexId":"deleteIndex",
                "flushindex/:indexId":"flushIndex",
                "openindex/:indexId":"openIndex",
                "closeindex/:indexId":"closeIndex",
                "clearcacheindex/:indexId":"clearCacheIndex",
                "optimizeindex/:indexId":"optimizeIndex",
                "refreshindex/:indexId":"refreshIndex",
                "index/:indexId":"index",
                "createalias/:indexId":"createAlias",
                "deletealias/:indexId":"deleteAlias",
                "refreshindexpoller/:indexId":"refreshIndexPoller",
                "mappings/:indexId/:mapName":"mappings",
                "deletemapping/:indexId/:mapName":"deleteMapType",
                "createmapping":"createMapping",
                "mappings":"mappings",
                "restapi":"viewRest",
                "restcall/:command":"callRest",
                "jsoneditor":"jsoneditor",
                "admin":"admin",
                "admin/action":"admin",
                "documents":"queryView",
                "snapshots":"snapshots",
                "viewsettings":"viewSettings",
                "visualize":"visualize",
                "*actions":"defaultRoute"
            },
            cluster:function () {
                stopAllPollers();
                clusterRoute.cluster();
            },
            refreshCluster:function () {
                router.navigate('cluster', true);
            },
            nodeDiagnostics:function () {
                stopAllNodePollers();
                nodeRoute.diagnoseNodes();
            },
            refreshNodeDiagnostics:function () {
                router.navigate('nodediagnostics', true);
            },
            nodes:function (nodeId) {
                stopAllNodePollers(); // why was i stopping all pollers? changed to only stop node poller.
                nodeRoute.nodeInfo(nodeId);
            },
            killNode:function (nodeId) {
                $('#killnodemodal').modal('hide');
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
                stopAllNodePollers();
                indicesRoute.viewIndices();
            },
            refreshIndices:function () {
                router.navigate('indices', true);
            },
            optimizeall:function () {
                indicesRoute.optimizeAll();
            },
            flushall:function () {
                indicesRoute.flushAll();
            },
            clearcacheall:function () {
                indicesRoute.clearCacheAll();
            },
            refreshAll:function () {
                indicesRoute.refreshAll();
            },
            createIndex:function () {
                stopAllNodePollers();
                var createIndexModel = new IndexModel({connectionRootURL:cluster.get("connectionRootURL")});
                if (this.createIndexView === undefined) {
                    this.createIndexView = new CreateIndexView({model:createIndexModel});
                }
                this.createIndexView.render();
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
            openIndex:function (indexId) {
                indexRoute.openIndex(indexId);
            },
            closeIndex:function (indexId) {
                indexRoute.closeIndex(indexId);
            },
            index:function (indexId) {
                stopAllNodePollers();
                indexRoute.indexView(indexId);
            },
            createAlias:function (indexId) {
                stopAllNodePollers();
                var createAliasModel = new IndexAliasModel({connectionRootURL:cluster.get("connectionRootURL")});
                if (this.createAliasView === undefined) {
                    this.createAliasView = new CreateAliasView({model:createAliasModel});
                }
                this.createAliasView.indexId = indexId;
                this.createAliasView.render();
            },
            refreshIndexPoller:function (indexId) {
                router.navigate('index/' + indexId, true);
            },
            mappings:function (indexId, mapName) {
                stopAllNodePollers();
                mapRoute.viewMappings(indexId, mapName);
            },
            deleteMapType:function (indexId, mapName) {
                stopAllNodePollers();
                mapRoute.deleteMapType(indexId, mapName);
            },
            createMapping:function () {
                stopAllNodePollers();
                mapRoute.createMapping();
            },
            viewRest:function () {
                stopAllNodePollers();
                restRoute.view();
            },
            queryView:function () {
                stopAllNodePollers();
                queryRoute.init();
            },
            callRest:function (command) {
                stopAllNodePollers();
                restRoute.json(command);
            },
            jsoneditor:function (command) {
                stopAllNodePollers();
                restRoute.editorView();
            },
            snapshots:function () {
                stopAllNodePollers();
                snapShotRoute.init();
            },
            viewSettings:function () {
                stopAllNodePollers();
                if (this.settingsView === undefined) {
                    this.settingsView = new SettingsView({model:settingsModel});
                }
                this.settingsView.render();
            },
            visualize:function () {
                stopAllNodePollers();
                visualRoute.init();
            }
            /*,
             defaultRoute:function () {
             stopAllNodePollers();
             console.log('defaultRoute');
             }*/
        });

        Backbone.history.start();
        router = new elasticHQRouter();
    })
;