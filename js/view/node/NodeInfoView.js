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
            maxint:6,
            cdata:undefined,
            plot:undefined,
            render:function () {
                var JSONModel = this.model.toJSON();
                var nodeId = JSONModel.nodeId;
                var jvmStats = JSONModel.nodes[nodeId].jvm;
                var cpuStats = JSONModel.nodes[nodeId].process;
                var nodeName = JSONModel.nodes[nodeId].name;
                var address = JSONModel.nodes[nodeId].transport_address;
                var hostName = JSONModel.nodes[nodeId].hostname;
                var mem = JSONModel.nodes[nodeId].mem;
                var threadPool = JSONModel.nodes[nodeId].thread_pool;
                var fileSystem = JSONModel.nodes[nodeId].fs;
                var threads = JSONModel.nodes[nodeId].threads;
                var indices = JSONModel.nodes[nodeId].indices;


                var tpl = _.template(nodeTemplate.nodeInfo);
                $('#workspace').html(tpl(
                    {
                        jvmStats:jvmStats,
                        nodeId:nodeId,
                        cpuStats:cpuStats,
                        nodeName:nodeName,
                        address:address,
                        hostName:hostName,
                        mem:mem,
                        threadPool:threadPool,
                        fileSystem:fileSystem,
                        threads:threads,
                        indices:indices
                    }));

                if (this.cdata == undefined) {
                    this.cdata = [
                        [new Date().getTime() + 1000, 100],
                        [new Date().getTime() + 1001, 200],
                        [new Date().getTime() + 1002, 150],
                        [new Date().getTime() + 1003, 130],
                        [new Date().getTime() + 1004, 120],
                        [new Date().getTime() + 1005, 230]
                    ]
                }
                else {
                    //if (this.cdata.length > 5)
                    this.cdata.shift(); // remove first item
                }
                var now = new Date().getTime();
                this.cdata.push([now += 1000, Math.random() * 300]);

                var options = {
                    series:{
                        curvedLines:{
                            active:true
                        },
                        color:"GREEN"
                    },
                    legend:{
                        noColumns:1
                    },
                    grid:{
                        backgroundColor:{ colors:[ "#fff", "#eee" ] }
                    },
                    xaxis:{ mode:"time", tickSize:[8, "second"], tickLength: 20, timeformat:"%h:%M:%S"
                    }
                };

                if (this.plot == undefined) // initial draw
                    this.plot = $.plot($("#placeholder"), [
                        {label:"sin(x)", data:this.cdata, lines:{ show:true, fill:true, fillColor:"#C3C3C3", lineWidth:3}, curvedLines:{apply:true}}
                    ], options);

                else {
                    this.plot = $.plot($("#placeholder"), [
                        {label:"sin(x)", data:this.cdata, lines:{ show:true, fill:true, fillColor:"#C3C3C3", lineWidth:3}, curvedLines:{apply:true}}
                    ], options);
                    this.plot.setData([this.cdata]);
                }
                return this;
            }
        })
    ;