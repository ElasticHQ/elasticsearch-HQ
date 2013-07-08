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
var activeTab = 'indexTab';
var IndexView = Backbone.View.extend(
    {
        initialize:function (args) {
            this.statusModel = args.statusModel;
            this.healthModel = args.healthModel;
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
            var totalShards = indexStats._shards;
            var stats = indexStats.indices[this.model.indexId];
            var indexStatus = this.statusModel.toJSON();
            var health = this.healthModel.toJSON();
            var status = indexStatus.indices[this.model.indexId];
            var _shards = [];
            _shards = _.values(indexStatus.indices[this.model.indexId].shards);
            var index = $.extend({}, stats, status, health);

//console.log(JSON.stringify(index));

            // assemble shards
            var nodeList = cluster.get('nodeList');
            var shards = [];
            for (var $i = 0; $i < _shards.length; $i++) {
                // shards may have one or many replicas
                var shardArr = _shards[$i];
                for (var $j = 0; $j < shardArr.length; $j++) {
                    var nodeid = shardArr[$j].routing.node;
                    if (nodeList.models != undefined) {
                        for (var $k = 0; $k < nodeList.models.length; $k++) {
                            if (nodeid == nodeList.models[$k].id) {
                                shardArr[$j].node = nodeList.models[$k].attributes.name;
                            }
                        }
                    }
                    shards.push(shardArr[$j]);
                }
            }

            // statusClass


            var tpl = _.template(indexTemplate.indexView);
            $('#workspace').html(tpl(
                {
                    indexId:_this.model.indexId,
                    indexName:indexName,
                    index:index,
                    totalShards:totalShards,
                    isOpenState:isOpenState,
                    shards:shards,
                    lastUpdateTime:timeUtil.lastUpdated()
                }));

            //$('#indexTab').tab('show');
            // $('#shardTab').tab('show');

            $("#shardTable").tablesorter({ sortList:[
                [0, 0]
            ] });

            // because of polling, we must set the current selected tab to show.
            $('a[data-toggle="tab"]').on('shown', function (e) {
                // e.target; // activated tab
                // e.relatedTarget; // previous tab
                activeTab = e.target.id;
            });
            $('#' + activeTab).tab('show');

            $("[rel=popRight]").popover();
            $("[rel=tipRight]").tooltip();

            return this;
        },
        indexId:undefined,
        healthModel:undefined,
        statusModel:undefined,
        model:undefined
    }
);