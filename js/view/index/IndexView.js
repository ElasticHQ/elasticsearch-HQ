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
            this.aliasModel = args.aliasModel;
            this.shardModel = args.shardModel;
            this.routingTableModel = args.routingTableModel;
        },
        render:function () {
            var _this = this;
            var indexName = _this.model.indexId;
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
            var _aliases = this.aliasModel.toJSON();
            var aliases = _aliases[this.model.indexId];
            var status = indexStatus.indices[this.model.indexId];

            // status label
            if (health.status == 'yellow') {
                health.statusClassLabel = 'warning';
                health.statusText = 'Yellow';
            }
            else if (health.status == 'green') {
                health.statusClassLabel = 'success';
                health.statusText = 'Green';
            }
            else if (health.status == 'red') {
                health.statusClassLabel = 'important';
                health.statusText = 'Red';
            }

            var index = $.extend({}, stats, status, health, aliases);

            if (versionUtil.isNewer("1.7",  cluster.versionNumber.concat)) {
                index.docs = {}
                index.docs.num_docs = index.primaries.docs.count;
                index.docs.num_docs = index.total.docs.count;
                index.index = {}
                index.index.primary_size_in_bytes = index.primaries.store.size_in_bytes;
                index.index.size_in_bytes = index.total.store.size_in_bytes;
            }

            var nodeMap = {};
            
            $.each(cluster.get('nodeList').models, function(_, node) {
              nodeMap[node.id] = node;
            });

            var routingTable = this.routingTableModel.toJSON().routing_table.indices[this.model.indexId].shards;
            var shardsStats = this.shardModel.toJSON().indices[this.model.indexId].shards;
            var unassignedIdx = 0;

            var shards = {}

            $.each(routingTable, function(shardNum, shardCopies) {
              $.each(shardCopies, function(_, shard) {
                var key = shard.shard + ':';
                
                if (shard.node) {
                  key += shard.node;
                } else {
                  key += 'UNASSIGNED:' + unassignedIdx;
                  ++unassignedIdx;
                }
                
                shard.num_docs = 0;
                shard.size_in_bytes = 0;
                shards[key] = shard;
              });
            });

            $.each(shardsStats, function(shardNum, shardCopies) {
              $.each(shardCopies, function(_, shard) {
                var key = shardNum + ':' + shard.routing.node;
                var s = shards[key];

                s.num_docs = shard.docs.count;
                s.size_in_bytes = shard.store.size_in_bytes;

                s.node = nodeMap[s.node].attributes.name;
              });
            });

            var tpl = _.template(indexTemplate.indexView);
            $('#workspace').html(tpl(
                {
                    indexId:_this.model.indexId,
                    indexName:indexName,
                    index:index,
                    totalShards:totalShards,
                    isOpenState:isOpenState,
                    shards:shards,
                    polling:settingsModel.get('settings').poller.index,
                    lastUpdateTime:timeUtil.lastUpdated()
                }));

            $("#shardTable").tablesorter({
                headers:{ 3:{ sorter:'datasize' }},
                widgets:['sortPersist']
                //,
                //sortList:[ [0, 0] ]
            });

            // because of polling, we must set the current selected tab to show.
            $('a[data-toggle="tab"]').on('shown', function (e) {
                // e.target; // activated tab
                // e.relatedTarget; // previous tab
                activeTab = e.target.id;
            });
            $('#' + activeTab).tab('show');

            // on the delete click, show confirmation modal and stop the background polling, or it will refresh the
            // workspace and close the modal.
            $(document).on("click", ".opendeletealiasmodal", function () {
                var myAliasId = $(this).data('id');
                $(".modal-body #deleteAliasId").val(myAliasId);
                $('#deletealiasmodal').modal('show');
                indexPoller.stop();
            });

            // on closing of the delete confirmation modal, resume polling the index.
            $('#deletealiasmodal').on('hidden', function () {
                indexPoller.start();
            });

            // if someone confirms deletion of an index...
            $('#deleteIndexBtn').on('click', function () {
                _this.deleteAlias();
            });

            $("[rel=popRight]").popover();
            $("[rel=tipRight]").tooltip();
            prettyPrint();

            return this;
        },
        deleteAlias:function () {
            var _this = this;
            var aliasId = $('#deleteAliasId').val();
            var indexId = this.model.indexId;

            // create new model used only for delete, as the url is different...
            var delAliasModel = new IndexAliasModel({connectionRootURL:cluster.get("connectionRootURL"), indexId:undefined});

            delAliasModel.save(
                {
                    "actions":[
                        {
                            "remove":{ "index":indexId, "alias":aliasId}
                        }
                    ]
                },
                {
                    success:function (model, response) {
                        show_stack_bottomright({type:'success', title:'Alias Deleted', text:'"' + aliasId + '" alias deleted.'});
                        $('#deletealiasmodal').modal('hide');
                    },
                    error:function (model, response, options) {
                        {
                            var err = '<p>Server Response is...</p><pre class="prettyprint language-json">' + response.responseText + '</pre>';
                            show_stack_bottomright({type:'error', title:'Alias Delete Failed', text:err, hide:false, closer_hover:false});
                            prettyPrint();
                            $('#deletealiasmodal').modal('hide');
                        }
                    }
                }
            );
        },
        indexId:undefined,
        aliasModel:undefined,
        healthModel:undefined,
        statusModel:undefined,
        model:undefined
    }
);
