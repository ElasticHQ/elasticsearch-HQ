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

var NodeStatsListView = Backbone.View.extend(
        {
            initialize:function (args) {
                this.infoModel = args.infoModel;
            },
            render:function () {

                var nodeStatModel = this.model.toJSON();
                var nodeInfo = this.infoModel.toJSON();
                var nodeArray = [];

                var summaryArray = [];

                var keysArray = [
                    {title:'Name', key:'nodeName'},
                    {title:'IP', key:'address' },
                    {title:'NodeID', key:'nodeId'},
                    {title:'JVM Uptime', key:'jvmStats.uptime'}
                ];

                // sorting is only really necessary if we plan to auto-refresh the screen
                var sortArray = [];
                for (i in nodeStatModel.nodes) {

                    var node = new NodeSimple();
                    node.nodeId = i;
                    sortArray.push(node);
                }
                // order by id
                sortArray.sort(function (a, b) {
                    var keyA = a.nodeId,
                        keyB = b.nodeId;
                    if (keyA < keyB) return -1;
                    if (keyA > keyB) return 1;
                    return 0;
                }); // end sort

                for (var i = 0; i < sortArray.length; i++) {
                    var nodeId = sortArray[i].nodeId;

                    var node = new NodeSimple();
                    node.id = nodeId;
                    node.stats = nodeStatModel.nodes[nodeId];
                    node.info = nodeInfo.nodes[nodeId];

                    node.stats.transport_address = nodeStatModel.nodes[nodeId].transport_address.replace(/inet\[\/([^\]]+)\]/, "$1");

                    // check for empty values -- some server configuration do not return full datasets
                    var jvmVal = true;
                    var osVal = true;
                    var indicesVal = true;
                    var httpVal = true;
                    if (!node.stats.jvm) {
                        jvmVal = false;
                        node.stats.jvm = {};
                        node.stats.jvm.mem = {};
                        node.stats.jvm.gc = {};
                        node.stats.jvm.gc.collectors = {};
                        node.stats.jvm.gc.collectors.ConcurrentMarkSweep = {};
                        node.stats.jvm.gc.collectors.ParNew = {};

                    }
                    if (!node.stats.os) {
                        osVal = false;
                        node.stats.os = {};
                        node.stats.os.mem = {};
                        node.stats.os.swap = {};
                    }

                    if (!node.stats.indices) {
                        indicesVal = false;
                        node.stats.indices = {};
                        node.stats.indices.docs = {};
                        node.stats.indices.flush = {};
                        node.stats.indices.refresh = {};
                        node.stats.indices.get = {};
                        node.stats.indices.search = {};
                        node.stats.indices.indexing = {};
                        node.stats.indices.merges = {};
                        node.stats.indices.filter_cache = {};
                        node.stats.indices.id_cache = {};
                    }

                    if (!node.stats.http) {
                        httpVal = false;
                        node.stats.http = {};
                    }

                    node.stats.jvm.uptime = (node.stats.jvm.uptime_in_millis / 1000 / 60 / 60 / 24).toFixed(2);

                    node.stats.docsdeletedperc = node.stats.indices.docs.deleted / node.stats.indices.docs.count;
                    node.stats.mergerate = node.stats.indices.merges.total_size_in_bytes / node.stats.indices.merges.total_time_in_millis / 1000

                    // actions
                    node.stats.flush = node.stats.indices.flush.total_time_in_millis / node.stats.indices.flush.total;
                    node.stats.refresh = node.stats.indices.refresh.total_time_in_millis / node.stats.indices.refresh.total;
                    node.stats.getmissing = node.stats.indices.get.missing_time_in_millis / node.stats.indices.get.missing_total;
                    node.stats.getexists = node.stats.indices.get.exists_time_in_millis / node.stats.indices.get.exists_total;
                    node.stats.gettotal = node.stats.indices.get.time_in_millis / node.stats.indices.get.total;
                    node.stats.searchfetch = node.stats.indices.search.fetch_time_in_millis / node.stats.indices.search.fetch_total;
                    node.stats.searchquery = node.stats.indices.search.query_time_in_millis / node.stats.indices.search.query_total;
                    node.stats.indexdelete = node.stats.indices.indexing.delete_time_in_millis / node.stats.indices.indexing.delete_total;
                    node.stats.indexindexing = node.stats.indices.indexing.index_time_in_millis / node.stats.indices.indexing.index_total;

                    // cache
                    node.stats.filterevictions = node.stats.indices.filter_cache.evictions / node.stats.indices.search.query_total;
                    node.stats.idpercentage = node.stats.indices.id_cache.memory_size_in_bytes / node.stats.jvm.mem.heap_committed_in_bytes;

                    // memory
                    node.stats.totalmem = 0;
                    node.stats.heappercram = 0;
                    if (!jQuery.isEmptyObject(node.stats.os.mem)) {
                        node.stats.totalmem = ( node.stats.os.mem.actual_used_in_bytes + node.stats.os.mem.actual_free_in_bytes ) / 1024 / 1024 / 1024;
                        node.stats.heappercram = node.stats.jvm.mem.heap_committed_in_bytes / (node.stats.os.mem.actual_used_in_bytes + node.stats.os.mem.actual_free_in_bytes);
                    }
                    node.stats.heapsize = node.stats.jvm.mem.heap_committed_in_bytes / 1024 / 1024 / 1024;

                    node.stats.heapused = node.stats.jvm.mem.heap_used_in_bytes / node.stats.jvm.mem.heap_committed_in_bytes;

                    node.stats.gcfreq = 0;
                    node.stats.gcduration = 0;
                    try {
                        if (node.stats.jvm.gc.collectors.ConcurrentMarkSweep.collection_count == 0) {
                            node.stats.gcfreq = 0;
                        } else {
                            node.stats.gcfreq = node.stats.jvm.uptime_in_millis / node.stats.jvm.gc.collectors.ConcurrentMarkSweep.collection_count / 1000;
                        }
                    }
                    catch (e) {
                        // default to 0;
                    }

                    try {
                        node.stats.gcduration = node.stats.jvm.gc.collectors.ConcurrentMarkSweep.collection_time_in_millis / node.stats.jvm.gc.collectors.ConcurrentMarkSweep.collection_count;
                    }
                    catch (e) {
                        // default to 0
                    }

                    if (node.stats.jvm.gc.collectors.ParNew) {
                        node.stats.gcparnew = node.stats.jvm.uptime_in_millis / node.stats.jvm.gc.collectors.ParNew.collection_count / 1000;
                        node.stats.gcparnewduration = node.stats.jvm.gc.collectors.ParNew.collection_time_in_millis / node.stats.jvm.gc.collectors.ParNew.collection_count;
                    }
                    else {
                        node.stats.gcparnew = 0;
                        node.stats.gcparnewduration = 0;
                    }

                    node.stats.swap = 0;
                    if (!jQuery.isEmptyObject(node.stats.os.swap)) {
                        node.stats.swap = node.stats.os.swap.used_in_bytes / 1024 / 1024;
                    }

                    // network
                    node.stats.httpconnectrate = node.stats.http.total_opened / node.stats.jvm.uptime_in_millis * 1000;

                    nodeArray.push(node);
                }

                var tpl = _.template(nodeTemplate.diagnostics);
                $('#workspace').html(tpl(
                    {
                        nodes:nodeArray,
                        labels:keysArray,
                        generalRules:general_rules(),
                        fsRules:fs_rules(),
                        actionRules:action_rules(),
                        cacheRules:cache_rules(),
                        memoryRules:memory_rules(),
                        networkRules:network_rules(),
                        polling: settingsModel.get('settings').poller.nodeDiagnostics,
                        lastUpdateTime:timeUtil.lastUpdated()
                    }));

                $("[rel=tipRight]").tooltip();
                $("[rel=popRight]").popover({});

                // show warnings for missing data
                if (!jvmVal || !osVal || !indicesVal || !httpVal)
                    show_stack_bottomright({type:'error', title:'Missing Data', text:'Incomplete dataset from server. Some values left intentionally blank.'});

                return this;
            },
            renderedModal:false,
            infoModel:undefined,
            nodeInfo:undefined
        })
    ;