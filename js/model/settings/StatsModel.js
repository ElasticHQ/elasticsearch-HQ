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

var StatsModel = Backbone.Model.extend({
    defaults:{
        stats:{
            uuid:null,
            numnodes:null,
            numdatanodes:null,
            primaryshards:null,
            replicashards:null,
            indices:null,
            types:null,
            documents:null,
            storesize:null,
            totalmemory:null,
            heapcommitted:null,
            cpucores:null,
            plugins:null,
            javaversion:null,
            esversion:null
        }
    },
    initialize:function () {
        console.log("Init Stats Model");
        this.buildStatsModel();
    },
    url:function () {
        return '/';
    },
    buildStatsModel:function () {
        console.log("Assembling Stats");

        var _this = this;
        try // assemble post data.
        {
            //var allNodeInfo = new NodeInfoModel({connectionRootURL:cluster.get("connectionRootURL")});
            var allNodeInfo = new NodeInfoModelFactory().create();

            $.when(allNodeInfo.fetch()).done(function (allNodeInfo) {

                _this.get('stats').uuid = settingsModel.get('settings').uuid;
                _this.get('stats').numnodes = cluster.get('clusterHealth').get('number_of_nodes');
                _this.get('stats').numdatanodes = cluster.get('clusterHealth').get('number_of_data_nodes');
                _this.get('stats').primaryshards = cluster.get('clusterHealth').get('active_primary_shards');
                _this.get('stats').replicashards = cluster.get('clusterHealth').get('active_shards') - cluster.get('clusterHealth').get('active_primary_shards');
                _this.get('stats').indices = _.size(cluster.get('clusterState').get('metadata').indices);
                _this.get('stats').documents = cluster.get('indexStats').get('_all').primaries.docs.count;
                _this.get('stats').storesize = cluster.get('indexStats').get('_all').primaries.store.size_in_bytes;

                _.each(cluster.get('clusterState').get('metadata').indices, function (index) {
                    _.each(index.mappings, function (mapping) {
                        _this.get('stats').types++;
                    });
                });

                //
                var master_node = cluster.get('clusterState').get('master_node');
                var theNode = allNodeInfo.nodes[cluster.get('clusterState').get('master_node')];
                if (theNode.jvm !== undefined) {
                    _this.get('stats').javaversion = theNode.jvm.version;
                    if (theNode.jvm.mem !== undefined) {
                        _this.get('stats').heapcommitted = theNode.jvm.mem.heap_init_in_bytes;
                    }
                }
                if (theNode.os !== undefined) {
                    if (theNode.os.cpu !== undefined) {
                        _this.get('stats').cpucores = theNode.os.cpu.total_cores;
                    }
                    if (theNode.os.mem !== undefined) {
                        _this.get('stats').totalmemory = theNode.os.mem.total_in_bytes;
                    }
                }
                _this.get('stats').plugins = _.size(theNode.plugins);
                _this.get('stats').esversion = theNode.version;


                $.ajax({
                    type:'POST',
                    url:REMOTE_API_PATH + '/statspost.php',
                    processData:false,
                    cache:false,
                    crossDomain:true,
                    dataType:'json',
                    data:JSON.stringify(_this.get('stats')),
                    success:function (data) {

                    },
                    error:function (XMLHttpRequest, textStatus, errorThrown) {
                        // die silently
                        console.log('ERROR! ' + XMLHttpRequest.responseText);
                    }
                });
            });//,
            /*                error:function (model, response, options) {
             // die silently
             console.log('ERROR! ' + response.responseText);
             }*/
            // });
        }
        catch
            (e) {
            console.log('ERROR! ' + e.message);
        }

    }
});