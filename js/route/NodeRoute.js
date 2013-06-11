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

var nodeRoute = {};

nodeRoute.diagnoseNodes = function () {
    var nodeInfoListModel = new NodeInfoListModel({connectionRootURL:cluster.get("connectionRootURL")});
    var nodeStatsListModel = new NodeStatsListModel({connectionRootURL:cluster.get("connectionRootURL")});

    var nodeListView = new NodeStatsListView({infoModel:nodeInfoListModel, model:nodeStatsListModel});
    var _thisView = this;
    // This uses jQuery's Deferred functionality to bind render() so it runs
    // after BOTH models have been fetched
    $.when(nodeInfoListModel.fetch(), nodeStatsListModel.fetch())
        .done(function () {
            nodeListView.render();
        });
};