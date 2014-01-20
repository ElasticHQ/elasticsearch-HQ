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
        if (versionUtil.isNewer("0.99.0", cluster.versionNumber.concat)) {
            var model = new NodeInfoModel({nodeId:nodeId, connectionRootURL:cluster.get("connectionRootURL")}); //{
            model.url = function () {
                if (nodeId) {
                    return '/_nodes/' + nodeId + '?all=true';
                }
                else {
                    return '/_nodes?all=true';
                }
            };
            return model;
        }
        else {
            return  new NodeInfoModel({nodeId:nodeId, connectionRootURL:cluster.get("connectionRootURL")});
        }
    }
};

function NodeStatsModelFactory() {
    this.create = function (nodeId) {
        if (versionUtil.isNewer("0.99.0", cluster.versionNumber.concat)) {
            var model = new NodeStatsModel({nodeId:nodeId, connectionRootURL:cluster.get("connectionRootURL")}); //{
            model.url = function () {
                return '/_nodes/' + this.nodeId + '/stats?all=1';
            };
            return model;
        }
        else {
            return  new NodeStatsModel({nodeId:nodeId, connectionRootURL:cluster.get("connectionRootURL")});
        }
    }
};

function NodeListModelFactory () {}
