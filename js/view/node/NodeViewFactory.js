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

function NodeStatsViewFactory() {
    this.create = function (nodeStat,nodeInfo) {
        var view = new NodeStatView({model:nodeStat, infoModel:nodeInfo});
        if (versionUtil.isNewer("0.99.0", cluster.versionNumber.concat)) {
            view.buildJVMStats = function (nodeStat) {
                var jvmStats = nodeStat.nodes[nodeStat.nodeId].jvm;
                return jvmStats;
            };

            view.buildSettings = function(nodeInfo, nodeId)
            {
                var settings = {};
                if (!nodeInfo.nodes[nodeId].settings) {
                    nodeInfo.nodes[nodeId].settings = [];
                }
                settings.nodeName = nodeInfo.nodes[nodeId].settings['name'];
                settings.pathHome = nodeInfo.nodes[nodeId].settings['path'].home;
                if (nodeInfo.nodes[nodeId].settings['node'] !== undefined) {
                    settings.nodeMaster = nodeInfo.nodes[nodeId].settings['node'].master;
                    settings.nodeData = nodeInfo.nodes[nodeId].settings['node'].data;
                }
                // TODO: hack! for some reason, the master never returns a bool for either of these, yet the other nodes do.
                if (settings.nodeMaster === undefined && settings.nodeData === undefined) {
                    settings.nodeMaster = true;
                    settings.nodeData = true;
                }
                //settings.logPrefix = nodeInfo.nodes[nodeId].settings['logger.prefix'];
                settings.clusterName = nodeInfo.nodes[nodeId].settings['cluster'].name;
                settings.logPath = nodeInfo.nodes[nodeId].settings['path'].logs;
                settings.http_address = nodeInfo.nodes[nodeId].http_address;
                settings.host = nodeInfo.nodes[nodeId].host;
                return settings;
            }

            return view;
        }
        else {
            return  view;
        }
    }
}
