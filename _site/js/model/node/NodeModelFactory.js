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

function NodeInfoModelFactory() {
    this.create = function (nodeId) {
        var model = new NodeInfoModel({nodeId:nodeId, connectionRootURL:cluster.get("connectionRootURL")});
        if (versionUtil.isNewerOrEqual("5.0.0", cluster.versionNumber.concat)) {
            model.url = function () {
                return (nodeId) ? "/_nodes/" + (nodeId) + "/_all" : "/_nodes/_all"
            };
        }
        else if (versionUtil.isNewer("0.99.0", cluster.versionNumber.concat)) {
            model.url = function () {
                return (nodeId) ? "/_nodes/" + (nodeId) + "?all=true" : "/_nodes?all=true"
            };
        }
        return model;
    }
}

function NodeStatsModelFactory() {
    this.create = function (nodeId) {
        var model = new NodeStatsModel({nodeId:nodeId, connectionRootURL:cluster.get("connectionRootURL")});
        if (versionUtil.isNewerOrEqual("5.0.0", cluster.versionNumber.concat)) {
            model.url = function () {
                return '/_nodes/' + this.nodeId + '/stats/_all';
            };
        }
        else if (versionUtil.isNewer("0.99.0", cluster.versionNumber.concat)) {
            model.url = function () {
                return '/_nodes/' + this.nodeId + '/stats?all=1';
            };
        }
        return model;
    }
}

function NodeStatsListModelFactory() {
    this.create = function (selectedNodes) {
        var model = new NodeStatsListModel({connectionRootURL:cluster.get("connectionRootURL"), selectedNodes:selectedNodes});
        if (versionUtil.isNewer("0.99.0", cluster.versionNumber.concat)) {
            var urlSuffix = '?all=1';
            if (versionUtil.isNewerOrEqual("5.0.0", cluster.versionNumber.concat)) {
                urlSuffix = '/_all';
            }

            model.url = function () {
                var sNodes = this.get('selectedNodes');
                if (sNodes == undefined || sNodes.length === 0) {
                    return '/_nodes/stats' + urlSuffix;
                }
                else {
                    var nodes = '';
                    for (var i = 0; i < sNodes.length; i++) {
                        nodes = nodes + sNodes[i];
                        if (sNodes.length - 1 > i) {
                            nodes = nodes + ',';
                        }
                    }
                    return '/_nodes/' + nodes + '/stats' + urlSuffix;
                }


            };
        }
        return model;
    }
}

function NodeInfoListModelFactory() {
    this.create = function (selectedNodes) {
        var model = new NodeInfoListModel({connectionRootURL:cluster.get("connectionRootURL"), selectedNodes:selectedNodes});
        if (versionUtil.isNewer("0.99.0", cluster.versionNumber.concat)) {
            var urlSuffix = '?all=1';
            if (versionUtil.isNewerOrEqual("5.0.0", cluster.versionNumber.concat)) {
                urlSuffix = '/_all';
            }

            model.url = function () {
                var sNodes = this.get('selectedNodes');
                if (sNodes == undefined || sNodes.length === 0) {
                    return '/_nodes' + urlSuffix;
                }
                else {
                    var nodes = '';
                    for (var i = 0; i < sNodes.length; i++) {
                        nodes = nodes + sNodes[i];
                        if (sNodes.length - 1 > i) {
                            nodes = nodes + ',';
                        }
                    }
                    return '/_nodes/' + nodes + urlSuffix;
                }
            };
        }
        return model;
    }
}
