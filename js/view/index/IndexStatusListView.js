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
 * Responsible for drawing the main screen of the Indices section.
 */
var IndexStatusListView = Backbone.View.extend(
    {
        initialize:function (args) {
            this.indexStatsModel = args.indexStatsModel;
        },
        render:function () {
            var indexStatus = this.model.toJSON();

            var tpl = _.template(indexTemplate.indexList);
            $('#workspace').html(tpl(
                {/*
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
                 netInfo:netInfo,
                 netStats:netStats,
                 lastUpdateTime:timeUtil.lastUpdated()*/
                }));
            return this;
        },
        indexStatsModel:undefined
    }
);