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
            render:function () {
                var nodeStat = this.model.toJSON();
                var nodeId = nodeStat.nodeId;
                var jvmStats = nodeStat.nodes[nodeId].jvm;
                var osStats = nodeStat.nodes[nodeId].os;
                var processStats = nodeStat.nodes[nodeId].process;
                var nodeName = nodeStat.nodes[nodeId].name;
                var address = nodeStat.nodes[nodeId].transport_address;
                var hostName = nodeStat.nodes[nodeId].hostname;
                var threadPool = nodeStat.nodes[nodeId].thread_pool;
                var fileSystem = nodeStat.nodes[nodeId].fs;
                var threads = nodeStat.nodes[nodeId].threads;
                var indices = nodeStat.nodes[nodeId].indices;

                var nodeInfo = cluster.get("nodeInfo").toJSON();
                jvmStats.version = nodeInfo.nodes[nodeId].jvm.version;
                jvmStats.vm_name = nodeInfo.nodes[nodeId].jvm.vm_name;
                jvmStats.vm_vendor = nodeInfo.nodes[nodeId].jvm.vm_vendor;
                jvmStats.pid = nodeInfo.nodes[nodeId].jvm.pid;
                osStats.cpu.vendor = nodeInfo.nodes[nodeId].os.cpu.vendor;
                osStats.cpu.model = nodeInfo.nodes[nodeId].os.cpu.model;
                osStats.cpu.total_cores = nodeInfo.nodes[nodeId].os.cpu.total_cores;
                osStats.available_processors = nodeInfo.nodes[nodeId].os.available_processors;
                osStats.max_proc_cpu = 100 * osStats.available_processors

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
                        fileSystem:fileSystem,
                        threads:threads,
                        indices:indices,
                        lastUpdateTime:timeUtil.lastUpdated()
                    }));

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
                /*
                 var totalbytesgb = (osStats.mem.free_in_bytes + osStats.mem.used_in_bytes) / (1024 * 1024 * 1024);
                 this.memdata = chart.addData(this.memdata, [new Date().getTime() + 1, osStats.mem.used_in_bytes / (1024 * 1024 * 1024)]);
                 this.memdata.push([now, osStats.mem.used_in_bytes / (1024 * 1024 * 1024)]);
                 this.memchart = chart.draw("#chart-mem", this.memdata, chart.mem.options(totalbytesgb));
                 this.memchart.setData([this.memdata]);*/

                return this;
            },
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
            proccpuchart:undefined
        })
    ;