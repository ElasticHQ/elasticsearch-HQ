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
 * Index data view. Populates tabs using template.
 *
 * @type {*}
 */
var IndexView = Backbone.View.extend(
    {
        initialize:function (args) {
            this.statusModel = args.statusModel;
        },
        render:function () {
            var _this = this;
            var indexName = uppercaseFirst(_this.model.indexId);
            var isOpenState = true;

            try {
                var clusterState = cluster.get("clusterState").toJSON();
                var _state = clusterState.metadata.indices[this.model.indexId].state;
                if (_state != 'open') {
                    isOpenState = false;
                }
            }
            catch (e) {
//
            }

            var indexStats = this.model.toJSON();
            var shards = indexStats._shards;
            var stats = indexStats.indices[this.model.indexId];
            var indexStatus = this.statusModel.toJSON();
            var status = indexStatus.indices[this.model.indexId];
            var index = $.extend({}, stats, status);
//console.log(JSON.stringify(index));
            var tpl = _.template(indexTemplate.indexView);
            $('#workspace').html(tpl(
                {
                    indexId:_this.model.indexId,
                    indexName:indexName,
                    index:index,
                    shards:shards,
                    isOpenState:isOpenState
                }));

            $('#indexTab').tab('show');

            return this;
        },
        indexId:undefined,
        statusModel:undefined,
        model:undefined
    }
);