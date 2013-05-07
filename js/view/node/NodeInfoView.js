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

var NodeInfoView = Backbone.View.extend(
        {
            maxint:6,
            cdata:undefined,
            plot:undefined,
            render:function () {
                var JSONModel = this.model.toJSON();
                var nodeId = JSONModel.nodeId;
                var jvmStats = JSONModel.nodes[nodeId].jvm;

                var t = _.template(nodeTemplate.nodeInfo);
                $('#workspace').html(t({jvmStats:jvmStats}));

                if (this.cdata == undefined) {
                    this.cdata = [
                        [2, 100],
                        [3, 150],
                        [4, 200],
                        [5, 250]
                    ]
                }
                else {
                    this.cdata.shift(); // remove first item
                }

                this.cdata.push([this.maxint++, Math.floor(Math.random() * (300 - 100 + 1)) + 100]);

                if (this.plot == undefined) // initial draw
                    this.plot = $.plot($("#placeholder"), [this.cdata], {});
                else {
                    this.plot = $.plot($("#placeholder"), [this.cdata], {});
                    this.plot.setData([this.cdata]);
                    this.plot.draw();
                }
                return this;
            }
        })
    ;