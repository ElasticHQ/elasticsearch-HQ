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

var NodeInfoView = Backbone.View.extend(
        {
            render:function () {
                var JSONModel = this.model.toJSON();
                var nodeId = JSONModel.nodeId;
                var jvmStats = JSONModel.nodes[nodeId].jvm;
                var osStats = JSONModel.nodes[nodeId].os;
                var processStats = JSONModel.nodes[nodeId].process;
                var nodeName = JSONModel.nodes[nodeId].name;
                var address = JSONModel.nodes[nodeId].transport_address;
                var hostName = JSONModel.nodes[nodeId].hostname;
                var threadPool = JSONModel.nodes[nodeId].thread_pool;
                var fileSystem = JSONModel.nodes[nodeId].fs;
                var threads = JSONModel.nodes[nodeId].threads;
                var indices = JSONModel.nodes[nodeId].indices;

                //massage
                var jvmuptime = jvmStats.uptime.split('and');
                jvmStats.uptime = jvmuptime[0];
                osStats.mem.total = convert.bytesToSize(osStats.mem.free_in_bytes + osStats.mem.used_in_bytes, 2);
                osStats.swap.total = convert.bytesToSize(osStats.swap.used_in_bytes + osStats.swap.free_in_bytes, 2);
                osStats.mem.used = convert.bytesToSize(osStats.mem.used_in_bytes, 2);
                osStats.mem.free = convert.bytesToSize(osStats.mem.free_in_bytes, 2);
                osStats.swap.used = convert.bytesToSize(osStats.swap.used_in_bytes, 2);
                osStats.swap.free = convert.bytesToSize(osStats.swap.free_in_bytes, 2);

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

                return this;
            },
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
            memchart:undefined
        })
    ;