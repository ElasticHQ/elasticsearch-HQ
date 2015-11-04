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
        clusterStateModel: undefined,
        initialize: function (args) {
            this.clusterStateModel = args.clusterStateModel;
        },
        render: function () {
            var indexStatus = this.model.toJSON();

            var index;
            var indices = [];

            var clusterState = this.clusterStateModel.toJSON(); //cluster.get("clusterState").toJSON();
            /*
             var indices = {};
             var indexKeys = _.keys(indexStatus);
             for (var $i = 0; $i < indexKeys.length; $i++) {
             index = indexStatus[indexKeys[0]];
             index.cid = indexKeys[0];
             index.name = indexKeys[0];
             index.numshards = clusterState.metadata.indices[index.id].settings['index.number_of_shards'];
             index.numreplicas = clusterState.metadata.indices[index.id].settings['index.number_of_replicas'];
             index.status = clusterState.metadata.indices[index.id].state;
             if (index.docs === undefined) {
             index.docs = {num_docs:0};
             }
             indices.push(index);
             }*/


            for (var i = 0; i < indexStatus.length; i++) {
                index = indexStatus[i];
                index.cid = index.id;
                index.name = index.id;
                index.numshards = clusterState.metadata.indices[index.id].settings.index.number_of_shards;
                index.numreplicas = clusterState.metadata.indices[index.id].settings.index.number_of_replicas;
                index.status = clusterState.metadata.indices[index.id].state;
                if (index.docs === undefined) {
                    index.docs = {num_docs: 0};
                }

                if (versionUtil.isNewer('1.7', cluster.versionNumber.concat)) {
                    index.docs.num_docs = index.primaries.docs.count;
                    index.index = {}
                    index.index.primary_size_in_bytes = index.primaries.store.size_in_bytes;
                }

                indices.push(index);
            }

            // look for closed indices and append to bottom of arr
            try {
                var blocks = clusterState.blocks.indices;
                var blockKeys = _.keys(blocks);
                for (var j = 0; j < blockKeys.length; j++) {
                    index = {};
                    index.cid = index.id;
                    index.id = blockKeys[j];
                    index.name = blockKeys[j];
                    index.docs = {num_docs: 0};
                    index.index = {primary_size: 0};
                    index.status = 'closed';
                    indices.push(index);
                }
            }
            catch (e) {
            }

            var tpl = _.template(indexTemplate.indexList);
            $('#workspace').html(tpl(
                {
                    indices: indices,
                    polling: settingsModel.get('settings').poller.indices,
                    lastUpdateTime: timeUtil.lastUpdated()
                }));

            $("[rel=popRight]").popover();
            $("[rel=tipRight]").tooltip();

            if (!jQuery.isEmptyObject(indices)) {
                $("#indicesTable").tablesorter({
                    headers: {2: {sorter: 'datasize'}},
                    widgets: ['sortPersist']
                    /*                    sortList:[
                     [1, 1]
                     ]*/
                });
            }

            return this;
        }
    }
);