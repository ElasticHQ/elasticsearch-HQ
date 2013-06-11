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
                var keysArray = [
                    {title:'Name', key:'nodeName'},
                    {title:'IP', key:'address' },
                    {title:'NodeID', key:'nodeId'},
                    {title:'JVM Uptime', key:'jvmStats.uptime'}
                ];

                for (i in nodeStatModel.nodes) {

                    var newNode = new NodeSimple();
                    var nodeStat = nodeStatModel.nodes[i];

                    var nodeId = i;
                    var jvmStats = nodeStat.jvm;
                    var osStats = nodeStat.os;
                    var processStats = nodeStat.process;
                    var nodeName = nodeStat.name;
                    var address = nodeStat.transport_address;
                    var hostName = nodeStat.hostname;
                    var threadPool = nodeStat.thread_pool;
                    var fileSystem = nodeStat.fs.data[0];
                    var threads = nodeStat.threads;
                    var indices = nodeStat.indices;
                    var netStats = nodeStat.transport;
                    //var httpStats = nodeStat.http;

                    jvmStats.version = nodeInfo.nodes[nodeId].jvm.version;
                    jvmStats.vm_name = nodeInfo.nodes[nodeId].jvm.vm_name;
                    jvmStats.vm_vendor = nodeInfo.nodes[nodeId].jvm.vm_vendor;
                    jvmStats.pid = nodeInfo.nodes[nodeId].jvm.pid;
                    osStats.cpu.vendor = nodeInfo.nodes[nodeId].os.cpu.vendor;
                    osStats.cpu.model = nodeInfo.nodes[nodeId].os.cpu.model;
                    osStats.cpu.total_cores = nodeInfo.nodes[nodeId].os.cpu.total_cores;
                    osStats.available_processors = nodeInfo.nodes[nodeId].os.available_processors;
                    osStats.max_proc_cpu = 100 * osStats.available_processors
                    var netInfo = nodeInfo.nodes[nodeId].network;
                    netInfo.transport = nodeInfo.nodes[nodeId].transport;
                    netInfo.transport.address = nodeInfo.nodes[nodeId].transport_address;
                    netInfo.http = nodeInfo.nodes[nodeId].http;
                    netInfo.http.address = nodeInfo.nodes[nodeId].http_address;

                    /*                    // for modal
                     var settings = {};
                     settings.nodeName = nodeInfo.nodes[nodeId].settings['name'];
                     settings.pathHome = nodeInfo.nodes[nodeId].settings['path.home'];
                     settings.nodeMaster = nodeInfo.nodes[nodeId].settings['node.master'];
                     settings.nodeData = nodeInfo.nodes[nodeId].settings['node.data'];
                     // TODO: hack! for some reason, the master never returns a bool for either of these, yet the other nodes do.
                     if (settings.nodeMaster == undefined && settings.nodeData == undefined) {
                     settings.nodeMaster = true;
                     settings.nodeData = true;
                     }
                     settings.logPrefix = nodeInfo.nodes[nodeId].settings['logger.prefix'];
                     settings.clusterName = nodeInfo.nodes[nodeId].settings['cluster.name'];
                     settings.logPath = nodeInfo.nodes[nodeId].settings['path.logs'];
                     settings.http_address = nodeInfo.nodes[nodeId].http_address;*/
                    /*                    var version = nodeInfo.nodes[nodeId].version;
                     var host = nodeInfo.nodes[nodeId].hostname;*/

                    //massage
                    var jvmuptime = jvmStats.uptime.split('and');
                    jvmStats.uptime = jvmuptime[0];
                    osStats.mem.total = convert.bytesToSize(osStats.mem.free_in_bytes + osStats.mem.used_in_bytes, 2);
                    osStats.swap.total = convert.bytesToSize(osStats.swap.used_in_bytes + osStats.swap.free_in_bytes, 2);
                    osStats.mem.used = convert.bytesToSize(osStats.mem.used_in_bytes, 2);
                    osStats.mem.free = convert.bytesToSize(osStats.mem.free_in_bytes, 2);
                    osStats.swap.used = convert.bytesToSize(osStats.swap.used_in_bytes, 2);
                    osStats.swap.free = convert.bytesToSize(osStats.swap.free_in_bytes, 2);
                    processStats.cpu.sys = processStats.cpu.sys.split('and')[0];
                    processStats.cpu.user = processStats.cpu.user.split('and')[0];
                    processStats.cpu.total = processStats.cpu.total.split('and')[0];

                    newNode.nodeId = nodeId;
                    newNode.jvmStats = jvmStats;
                    newNode.osStats = osStats;
                    newNode.processStats = processStats;
                    newNode.nodeName = nodeName;
                    newNode.address = address;
                    newNode.hostName = hostName;
                    newNode.threadPool = threadPool;
                    newNode.fileSystem = fileSystem;
                    newNode.threads = threads;
                    newNode.indices = indices;
                    newNode.netStats = netStats;
                    newNode.netInfo = netInfo;

                    nodeArray.push(newNode);
                }

                // order by id
                nodeArray.sort(function (a, b) {
                    var keyA = a.nodeId,
                        keyB = b.nodeId;
                    if (keyA < keyB) return -1;
                    if (keyA > keyB) return 1;
                    return 0;
                });

                var tpl = _.template(nodeTemplate.diagnostics);
                $('#workspace').html(tpl(
                    {
                        nodes:nodeArray,
                        labels:keysArray
                        //lastUpdateTime:timeUtil.lastUpdated()
                    }));

                $("[rel=tipRight]").tooltip();

                return this;
            },
            general_rules:function () {
                return [
                    {
                        "Name":{
                            "val":"stats.name"
                        }
                    },
                    {
                        "IP":{
                            "val":"stats.transport_address"
                        }
                    },
                    {
                        "ID":{
                            "val":"id"
                        }
                    },
                    {
                        "ES Uptime":{
                            "unit":"days",
                            "format":"float",
                            "val":"stats.jvm.uptime_in_millis / 1000 / 60 / 60 / 24"
                        }
                    },
                    {
                        "CPU":{
                            "val":"info.os.cpu.model"
                        }
                    },
                    {
                        "Cores":{
                            "val":"info.os.cpu.total_cores"
                        }
                    }
                ];
            },
            fs_rules:function () {
                return [
                    {
                        "Store size":{
                            "val":"stats.indices.store.size"
                        }
                    },
                    {
                        "Docs total":{
                            "format":"comma",
                            "val":"stats.indices.docs.count"
                        }
                    },
                    {
                        "Docs deleted %":{
                            "comment":"High values indicate insufficient merging. Slow I/O?",
                            "format":"pct",
                            "val":"stats.indices.docs.deleted / stats.indices.docs.count",
                            "upper_limit":[ "0.1", "0.25" ]
                        }
                    },
                    {
                        "Merge size":{
                            "val":"stats.indices.merges.total_size"
                        }
                    },
                    {
                        "Merge time":{
                            "val":"stats.indices.merges.total_time"
                        }
                    },
                    {
                        "Merge rate":{
                            "unit":"MB/s",
                            "comment":"Low rates indicate throttling or slow I/O",
                            "format":"float",
                            "val":"stats.indices.merges.total_size_in_bytes / stats.indices.merges.total_time_in_millis / 1000"
                        }
                    },
                    {
                        "File descriptors":{
                            "format":"comma",
                            "val":"stats.process.open_file_descriptors"
                        }
                    }
                ];
            },
            action_rules:function () {
                return [
                    {
                        "Indexing - index":{
                            "comment":"High values indicate complex documents or slow I/O or CPU.",
                            "format":"ms",
                            "val":"stats.indices.indexing.index_time_in_millis / stats.indices.indexing.index_total",
                            "upper_limit":[ "10", "50" ]
                        }
                    },
                    {
                        "Indexing - delete":{
                            "comment":"High values indicate slow I/O.",
                            "format":"ms",
                            "val":"stats.indices.indexing.delete_time_in_millis / stats.indices.indexing.delete_total",
                            "upper_limit":[ "5", "10" ]
                        }
                    },
                    {
                        "Search - query":{
                            "comment":"High values indicate complex or inefficient queries, insufficient use of filters, insufficient RAM for caching, slow I/O or CPU.",
                            "format":"ms",
                            "val":"stats.indices.search.query_time_in_millis / stats.indices.search.query_total",
                            "upper_limit":[ "50", "500" ]
                        }
                    },
                    {
                        "Search - fetch":{
                            "comment":"High values indicate slow I/O, large docs, or fetching too many docs, eg deep paging.",
                            "format":"ms",
                            "val":"stats.indices.search.fetch_time_in_millis / stats.indices.search.fetch_total",
                            "upper_limit":[ "8", "15" ]
                        }
                    },
                    {
                        "Get - total":{
                            "comment":"High values indicate slow I/O.",
                            "format":"ms",
                            "val":"stats.indices.get.time_in_millis / stats.indices.get.total",
                            "upper_limit":[ "5", "10" ]
                        }
                    },
                    {
                        "Get - exists":{
                            "comment":"???",
                            "format":"ms",
                            "val":"stats.indices.get.exists_time_in_millis / stats.indices.get.exists_total",
                            "upper_limit":[ "5", "10" ]
                        }
                    },
                    {
                        "Get - missing":{
                            "comment":"???",
                            "format":"ms",
                            "val":"stats.indices.get.missing_time_in_millis / stats.indices.get.missing_total",
                            "upper_limit":[ "2", "5" ]
                        }
                    },
                    {
                        "Refresh":{
                            "comment":"High values indicate slow I/O.",
                            "format":"ms",
                            "val":"stats.indices.refresh.total_time_in_millis / stats.indices.refresh.total",
                            "upper_limit":[ "10", "20" ]
                        }
                    },
                    {
                        "Flush":{
                            "comment":"High values indicate slow I/O.",
                            "format":"ms",
                            "val":"stats.indices.flush.total_time_in_millis / stats.indices.flush.total",
                            "upper_limit":[ "750", "1500" ]
                        }
                    }
                ];
            },
            cache_rules:function () {
                return [
                    {
                        "Field size":{
                            "val":"stats.indices.fielddata.memory_size"
                        }
                    },
                    {
                        "Field evictions":{
                            "comment":"Field values should not be evicted - insufficient RAM for current queries.",
                            "format":"comma",
                            "val":"stats.indices.fielddata.evictions",
                            "upper_limit":[ "0", "0" ]
                        }
                    },
                    {
                        "Filter size":{
                            "val":"stats.indices.cache.filter_size"
                        }
                    },
                    {
                        "Filter evictions":{
                            "unit":"per query",
                            "comment":"High values indicate insufficient RAM for current queries, or frequent use of one-off values in filters.",
                            "format":"float",
                            "val":"stats.indices.cache.filter_evictions / stats.indices.search.query_total",
                            "upper_limit":[ "0.1", "0.2" ]
                        }
                    },
                    {
                        "ID size":{
                            "val":"stats.indices.cache.id_cache_size"
                        }
                    },
                    {
                        "ID %":{
                            "val":"stats.indices.cache.id_cache_size_in_bytes / stats.jvm.mem.heap_committed_in_bytes",
                            "format":"pct",
                            "upper_limit":["0.2", "0.4"],
                            "comment":"Large parent/child ID caches reduce the amount of memory available on the heap."
                        }
                    }
                ];
            },
            memory_rules:function () {
                return [
                    {
                        "Total mem":{
                            "unit":"gb",
                            "format":"comma",
                            "val":"( stats.os.mem.actual_used_in_bytes + stats.os.mem.actual_free_in_bytes ) / 1024 / 1024 / 1024"
                        }
                    },
                    {
                        "Heap size":{
                            "unit":"gb",
                            "comment":"A heap size over 32GB causes the JVM to use uncompressed pointers and can slow GC.",
                            "format":"float",
                            "val":"stats.jvm.mem.heap_committed_in_bytes / 1024 / 1024 / 1024",
                            "upper_limit":[ "30", "32" ]
                        }
                    },
                    {
                        "Heap % of RAM":{
                            "comment":"Approx 40-50% of RAM should be available to the kernel for file caching.",
                            "format":"pct",
                            "val":"stats.jvm.mem.heap_committed_in_bytes / (stats.os.mem.actual_used_in_bytes + stats.os.mem.actual_free_in_bytes)",
                            "upper_limit":[ "0.6", "0.75" ]
                        }
                    },
                    {
                        "Heap used %":{
                            "format":"pct",
                            "val":"stats.jvm.mem.heap_used_in_bytes / stats.jvm.mem.heap_committed_in_bytes"
                        }
                    },
                    {
                        "GC MarkSweep frequency":{
                            "unit":"s",
                            "comment":"Too frequent GC indicates memory pressure and need for more heap space.",
                            "format":"comma",
                            "val":"stats.jvm.uptime_in_millis /  stats.jvm.gc.collectors.ConcurrentMarkSweep.collection_count / 1000",
                            "lower_limit":[ "30", "15", "0" ]
                        }
                    },
                    {
                        "GC MarkSweep duration":{
                            "comment":"Long durations may indicate that swapping is slowing down GC, or need for more heap space.",
                            "format":"ms",
                            "val":"stats.jvm.gc.collectors.ConcurrentMarkSweep.collection_time_in_millis / stats.jvm.gc.collectors.ConcurrentMarkSweep.collection_count",
                            "upper_limit":[ "150", "400" ]
                        }
                    },
                    {
                        "GC ParNew frequency":{
                            "unit":"s",
                            "format":"comma",
                            "val":"stats.jvm.uptime_in_millis / stats.jvm.gc.collectors.ParNew.collection_count / 1000"
                        }
                    },
                    {
                        "GC ParNew duration":{
                            "format":"ms",
                            "val":"stats.jvm.gc.collectors.ParNew.collection_time_in_millis / stats.jvm.gc.collectors.ParNew.collection_count",
                            "upper_limit":[ "100", "200" ]
                        }
                    },
                    {
                        "Swap":{
                            "val":"stats.os.swap.used_in_bytes / 1024 / 1024",
                            "unit":"mb",
                            "upper_limit":["1", "1"],
                            "comment":"Any use of swap by the JVM, no matter how small, can greatly impact the speed of the garbage collector."
                        }
                    }
                ];
            },
            network_rules:function () {
                return [
                    {
                        "HTTP connection rate":{
                            "unit":"per sec",
                            "comment":"Too many HTTP connection per second may exhaust the number of sockets available in the kernel, and cause a service outage.",
                            "format":"comma",
                            "val":"stats.http.total_opened / stats.jvm.uptime_in_millis * 1000",
                            "upper_limit":[ "5", "30" ]
                        }
                    }
                ];
            },
            renderedModal:false,
            infoModel:undefined,
            nodeInfo:undefined
        })
    ;