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
                    node.stats.jvm.uptime = (node.stats.jvm.uptime_in_millis / 1000 / 60 / 60 / 24).toFixed(2);
                    node.stats.docsdeletedperc = node.stats.indices.docs.deleted / node.stats.indices.docs.count;

                    /*                    var jvmStats = nodeStat.jvm;
                     var osStats = nodeStat.os;
                     var processStats = nodeStat.process;
                     var nodeName = nodeStat.name;
                     var address = nodeStat.transport_address.replace(/inet\[\/([^\]]+)\]/, "$1");
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
                     var host = nodeInfo.nodes[nodeId].hostname;

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

                     node.nodeId = nodeId;
                     node.jvmStats = jvmStats;
                     node.osStats = osStats;
                     node.processStats = processStats;
                     node.nodeName = nodeName;
                     node.address = address;
                     node.hostName = hostName;
                     node.threadPool = threadPool;
                     node.fileSystem = fileSystem;
                     node.threads = threads;
                     node.indices = indices;
                     node.netStats = netStats;
                     node.netInfo = netInfo;*/

                    nodeArray.push(node);
                }


                var tpl = _.template(nodeTemplate.diagnostics);
                $('#workspace').html(tpl(
                    {
                        nodes:nodeArray,
                        labels:keysArray,
                        generalRules:general_rules(),
                        fsRules:fs_rules()
                        //lastUpdateTime:timeUtil.lastUpdated()
                    }));

                $("[rel=tipRight]").tooltip();

                return this;
            },
            renderedModal:false,
            infoModel:undefined,
            nodeInfo:undefined
        })
    ;