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

/**
 * Represents a node view. Loads the data and charts for the selected node in the workspace.
 * @type {*}
 */

var NodeStatView = Backbone.View.extend(
    {
        initialize:function (args) {
            this.infoModel = args.infoModel;
        },
        buildJVMStats:function (nodeStat) {
            var jvmStats = nodeStat.nodes[nodeStat.nodeId].jvm;
            return jvmStats;
        },
        buildSettings:function (nodeInfo, nodeId) {
            var settings = {};
            if (!nodeInfo.nodes[nodeId].settings) {
                nodeInfo.nodes[nodeId].settings = [];
            }
            settings.nodeName = nodeInfo.nodes[nodeId].settings['name'];
            settings.pathHome = nodeInfo.nodes[nodeId].settings['path.home'];
            settings.nodeMaster = nodeInfo.nodes[nodeId].settings['node.master'];
            settings.nodeData = nodeInfo.nodes[nodeId].settings['node.data'];
            // TODO: hack! for some reason, the master never returns a bool for either of these, yet the other nodes do.
            if (settings.nodeMaster === undefined && settings.nodeData === undefined) {
                settings.nodeMaster = true;
                settings.nodeData = true;
            }
            settings.logPrefix = nodeInfo.nodes[nodeId].settings['logger.prefix'];
            settings.clusterName = nodeInfo.nodes[nodeId].settings['cluster.name'];
            settings.logPath = nodeInfo.nodes[nodeId].settings['path.logs'];
            settings.http_address = nodeInfo.nodes[nodeId].http_address;
            return settings;
        },
        render:function () {
            var nodeStat = this.model.toJSON();
            var nodeInfo = this.infoModel.toJSON();
            var nodeId = nodeStat.nodeId;
            var jvmStats = this.buildJVMStats(nodeStat);
            var osStats = nodeStat.nodes[nodeId].os;
            var processStats = nodeStat.nodes[nodeId].process;
            var nodeName = nodeStat.nodes[nodeId].name;
            var address = nodeStat.nodes[nodeId].transport_address;
            var hostName = nodeStat.nodes[nodeId].hostname;
            var threadPool = nodeStat.nodes[nodeId].thread_pool;

            var fileSystem = {};
            var fileSystemArr = [];
            if (!nodeStat.nodes[nodeId].fs) {
                fileSystem = nodeStat.nodes[nodeId].fs = {};
                fileSystem = nodeStat.nodes[nodeId].fs.data = [];
            }
            else {
                //fileSystem = nodeStat.nodes[nodeId].fs.data[0];
                // moved out of else
            }
            fileSystemArr = nodeStat.nodes[nodeId].fs.data;

            var threads = nodeStat.nodes[nodeId].threads;
            var indices = nodeStat.nodes[nodeId].indices;
            var netStats = nodeStat.nodes[nodeId].transport;
            var httpStats = nodeStat.nodes[nodeId].http;
            var netInfo = nodeInfo.nodes[nodeId].network;

            // check for empty values -- some server configuration do not return full datasets
            var jvmVal = true;
            var osVal = true;
            var indicesVal = true;
            var httpVal = true;
            if (jQuery.isEmptyObject(nodeInfo.nodes[nodeId].jvm)) {
                jvmVal = false;
                jvmStats = {};
                jvmStats.mem = {};
                jvmStats.threads = {};
                jvmStats.gc = {};
                jvmStats.gc.collectors = {};
                jvmStats.gc.collectors.young = {};
                jvmStats.gc.collectors.old = {};
                nodeInfo.nodes[nodeId].jvm = {};
            }
            if (jQuery.isEmptyObject(nodeInfo.nodes[nodeId].os) || jQuery.isEmptyObject(osStats)) {
                osVal = false;
                osStats = {};
                osStats.cpu = {};
                osStats.mem = {};
                osStats.swap = {};
                nodeInfo.nodes[nodeId].os = {};
                nodeInfo.nodes[nodeId].os.cpu = {};
            }
            if (jQuery.isEmptyObject(nodeStat.nodes[nodeId].process)) {
                processStats = {};
                processStats.cpu = {};
                processStats.cpu.sys = {};
                processStats.cpu.user = {};
                processStats.cpu.total = {};
                processStats.mem = {};
            }
            if (jQuery.isEmptyObject(netInfo)) {
                netInfo = {};
            }
            if (jQuery.isEmptyObject(nodeStat.nodes[nodeId].indices)) {
                indicesVal = false;
                indices = {};
                indices.docs = {};
                indices.store = {};
                indices.flush = {};
                indices.refresh = {};
                indices.get = {};
                indices.search = {};
                indices.indexing = {};
                indices.merges = {};
                indices.filter_cache = {};
                indices.id_cache = {};
            }
            if (jQuery.isEmptyObject(httpStats)) {
                httpStats = {};
            }
            if (jQuery.isEmptyObject(netStats)) {
                netStats = {};
            }
            if (jQuery.isEmptyObject(threadPool)) {
                threadPool = {};
                threadPool.index = {};
                threadPool.search = {};
                threadPool.get = {};
                threadPool.bulk = {};
                threadPool.refresh = {};
                threadPool.flush = {};
                threadPool.merge = {};
                threadPool.management = {};
            }

            jvmStats.version = nodeInfo.nodes[nodeId].jvm.version;
            jvmStats.vm_name = nodeInfo.nodes[nodeId].jvm.vm_name;
            jvmStats.vm_vendor = nodeInfo.nodes[nodeId].jvm.vm_vendor;
            jvmStats.pid = nodeInfo.nodes[nodeId].jvm.pid;

            osStats.cpu.vendor = nodeInfo.nodes[nodeId].os.cpu.vendor;
            osStats.cpu.model = nodeInfo.nodes[nodeId].os.cpu.model;
            osStats.cpu.total_cores = nodeInfo.nodes[nodeId].os.cpu.total_cores;
            osStats.available_processors = nodeInfo.nodes[nodeId].os.available_processors;
            osStats.max_proc_cpu = 100 * osStats.available_processors;

            netInfo.transport = nodeInfo.nodes[nodeId].transport;
            if (!netInfo.transport) {
                netInfo.transport = {};
            }
            netInfo.transport.address = nodeInfo.nodes[nodeId].transport_address;
            netInfo.http = nodeInfo.nodes[nodeId].http;
            if (!netInfo.http) {
                netInfo.http = {};
            }
            netInfo.http.address = nodeInfo.nodes[nodeId].http_address;

            // for modal
            var settings = this.buildSettings(nodeInfo, nodeId);

            var version = nodeInfo.nodes[nodeId].version;
            var host = nodeInfo.nodes[nodeId].hostname;

            //massage
            if (jvmStats.uptime) {
                jvmStats.uptime = jvmStats.uptime.split('and')[0];
            }
            osStats.mem.total = convert.bytesToSize(osStats.mem.free_in_bytes + osStats.mem.used_in_bytes, 2);
            osStats.swap.total = convert.bytesToSize(osStats.swap.used_in_bytes + osStats.swap.free_in_bytes, 2);
            osStats.mem.used = convert.bytesToSize(osStats.mem.used_in_bytes, 2);
            osStats.mem.free = convert.bytesToSize(osStats.mem.free_in_bytes, 2);
            osStats.swap.used = convert.bytesToSize(osStats.swap.used_in_bytes, 2);
            osStats.swap.free = convert.bytesToSize(osStats.swap.free_in_bytes, 2);

            try {
                processStats.cpu.sys = processStats.cpu.sys.split('and')[0];
                processStats.cpu.user = processStats.cpu.user.split('and')[0];
                processStats.cpu.total = processStats.cpu.total.split('and')[0];
            }
            catch (e) {
            }

            var tpl = _.template(nodeTemplate.nodeInfo);
            $('#workspace').html(tpl(
                {
                    jvmStats:jvmStats,
                    nodeId:nodeId,
                    osStats:osStats,
                    processStats:processStats,
                    nodeName:nodeName,
                    address:address,
                    hostName:hostName,
                    threadPool:threadPool,
                    fileSystemArr:fileSystemArr,
                    threads:threads,
                    indices:indices,
                    netInfo:netInfo,
                    netStats:netStats,
                    polling:settingsModel.get('settings').poller.node,
                    lastUpdateTime:timeUtil.lastUpdated()
                }));

            // show warnings for missing data
            if (!jvmVal || !osVal || !indicesVal || !httpVal) {
                show_stack_bottomright({type:'error', title:'Missing Data', text:'Incomplete dataset from server. Some values left intentionally blank.'});
            }

            // flag check: poller will cause modal to close if it's currently being viewed, as it tried to draw
            // the tpl every time.
            if (!this.renderedModal) {
                var modalTpl = _.template(nodeTemplate.nodeInfoModal);
                $('#infoModal-loc').html(modalTpl({
                    version:version,
                    host:host,
                    settings:settings
                }));
                //show_stack_bottomright({type:'info', title:'Tip', text:'Polling Node "' + nodeName + '" every 5 seconds.'});
            }
            this.renderedModal = true;


            $("#refreshNodeInfo").click(function () {
                // stopAllNodePollers();
                nodeRoute.refreshNodeInfo(nodeId);
            });

            // -------- Charting -------- //
            var now = new Date().getTime();

            // jvm
            this.jvmheapdata = chart.addData(this.jvmheapdata, [new Date().getTime() + 1, jvmStats.mem.heap_used_in_bytes / 1000000]);
            this.jvmheapdata.push([now, jvmStats.mem.heap_used_in_bytes / 1000000]);
            this.jvmheapchart = chart.draw("#chart-jvmheap", this.jvmheapdata, chart.jvmHeap.options());
            this.jvmheapchart.setData([this.jvmheapdata]);

            this.jvmnonheapdata = chart.addData(this.jvmnonheapdata, [new Date().getTime() + 1, jvmStats.mem.non_heap_used_in_bytes / 1000000]);
            this.jvmnonheapdata.push([now, jvmStats.mem.non_heap_used_in_bytes / 1000000]);
            this.jvmnonheapchart = chart.draw("#chart-jvmnonheap", this.jvmnonheapdata, chart.jvmHeap.options());
            this.jvmnonheapchart.setData([this.jvmnonheapdata]);

            // indices
            this.indexdata = chart.addData(this.indexdata, [new Date().getTime() + 1, indices.indexing.index_total]);
            this.indexdata.push([now, indices.indexing.index_total]);
            this.indexchart = chart.draw("#chart-index", this.indexdata, chart.indices.options());
            this.indexchart.setData([this.indexdata]);

            this.getdata = chart.addData(this.getdata, [new Date().getTime() + 1, indices.get.total]);
            this.getdata.push([now, indices.get.total]);
            this.getchart = chart.draw("#chart-indexget", this.getdata, chart.indices.options());
            this.getchart.setData([this.getdata]);

            //os
            var usedCPU = osStats.cpu.user + osStats.cpu.sys;
            this.cpudata = chart.addData(this.cpudata, [new Date().getTime() + 1, usedCPU]);
            this.cpudata.push([now, usedCPU]);
            this.cpuchart = chart.draw("#chart-cpu", this.cpudata, chart.cpu.options());
            this.cpuchart.setData([this.cpudata]);

            var totalbytesgb = (osStats.mem.free_in_bytes + osStats.mem.used_in_bytes) / (1024 * 1024 * 1024);
            this.memdata = chart.addData(this.memdata, [new Date().getTime() + 1, osStats.mem.used_in_bytes / (1024 * 1024 * 1024)]);
            this.memdata.push([now, osStats.mem.used_in_bytes / (1024 * 1024 * 1024)]);
            this.memchart = chart.draw("#chart-mem", this.memdata, chart.mem.options(totalbytesgb));
            this.memchart.setData([this.memdata]);

            // process
            this.proccpudata = chart.addData(this.proccpudata, [new Date().getTime() + 1, processStats.cpu.percent]);
            this.proccpudata.push([now, processStats.cpu.percent]);
            this.proccpuchart = chart.draw("#chart-procpu", this.proccpudata, chart.procscpu.options(100 * osStats.available_processors));
            this.proccpuchart.setData([this.proccpudata]);

            var totalprocmemgb = (processStats.mem.total_virtual_in_bytes) / (1024 * 1024 * 1024);
            var residentprocmemgb = (processStats.mem.resident_in_bytes) / (1024 * 1024 * 1024);
            this.procmemdata = chart.addData(this.procmemdata, [new Date().getTime() + 1, residentprocmemgb]);
            this.procmemdata.push([now, residentprocmemgb]);
            this.procmemchart = chart.draw("#chart-procmem", this.procmemdata, chart.procmem.options(totalprocmemgb));
            this.procmemchart.setData([this.procmemdata]);

            // fs
            for (var i = 0; i < fileSystemArr.length; i++) {
                fileSystem = fileSystemArr[i];
                this.fsreaddata = chart.addData(this.fsreaddata, [new Date().getTime() + 1, fileSystem.disk_reads]);
                this.fsreaddata.push([now, fileSystem.disk_reads]);
                this.fsreadchart = chart.draw("#chart-fsreads" + i, this.fsreaddata, chart.fsreads.options());
                this.fsreadchart.setData([this.fsreaddata]);

                this.fswritedata = chart.addData(this.fswritedata, [new Date().getTime() + 1, fileSystem.disk_writes]);
                this.fswritedata.push([now, fileSystem.disk_writes]);
                this.fswritechart = chart.draw("#chart-fswrites" + i, this.fswritedata, chart.fswrites.options());
                this.fswritechart.setData([this.fswritedata]);
            }

            // network
            this.httptxdata = chart.addData(this.httptxdata, [new Date().getTime() + 1, httpStats.current_open]);
            this.httptxdata.push([now, httpStats.current_open]);
            this.httptxchart = chart.draw("#chart-httpopen", this.httptxdata, chart.httpopen.options());
            this.httptxchart.setData([this.httptxdata]);

            this.transportdata = chart.addData(this.transportdata, [new Date().getTime() + 1, netStats.tx_count]);
            this.transportdata.push([now, netStats.tx_count]);
            this.transportchart = chart.draw("#chart-transporttx", this.transportdata, chart.transporttxcount.options());
            this.transportchart.setData([this.transportdata]);

            // threads
            this.threadindexdata = chart.addData(this.threadindexdata, [new Date().getTime() + 1, threadPool.index.active]);
            this.threadindexdata.push([now, threadPool.index.active]);
            this.threadindexchart = chart.draw("#chart-threadindex", this.threadindexdata, chart.threadindex.options());
            this.threadindexchart.setData([this.threadindexdata]);

            this.threadsearchdata = chart.addData(this.threadsearchdata, [new Date().getTime() + 1, threadPool.search.active]);
            this.threadsearchdata.push([now, threadPool.search.active]);
            this.threadsearchchart = chart.draw("#chart-threadsearch", this.threadsearchdata, chart.transporttxcount.options());
            this.threadsearchchart.setData([this.threadsearchdata]);

            $("[rel=tipRight]").tooltip();

            return this;
        },
        renderedModal:false,
        infoModel:undefined,
        nodeInfo:undefined,
        jvmheapdata:undefined,
        jvmheapchart:undefined,
        jvmnonheapdata:undefined,
        jvmnonheapchart:undefined,
        indexdata:undefined,
        indexchart:undefined,
        getdata:undefined,
        getchart:undefined,
        cpudata:undefined,
        cpuchart:undefined,
        memdata:undefined,
        memchart:undefined,
        proccpudata:undefined,
        proccpuchart:undefined,
        procmemdata:undefined,
        procmemchart:undefined,
        fsreaddata:undefined,
        fsreadchart:undefined,
        fswritedata:undefined,
        fswritechart:undefined,
        httptxdata:undefined,
        httptxchart:undefined,
        transportdata:undefined,
        transportchart:undefined,
        threadindexdata:undefined,
        threadindexchart:undefined,
        threadsearchdata:undefined,
        threadsearchchart:undefined
    });