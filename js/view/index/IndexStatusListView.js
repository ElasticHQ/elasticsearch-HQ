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
        render:function () {
            var indexStatus = this.model.toJSON();

            var indices = [];

            var clusterState = cluster.get("clusterState").toJSON();

            for (var $i = 0; $i < indexStatus.length; $i++) {
                var index = indexStatus[$i];
                index.name = uppercaseFirst(index.id);
                index.numshards = clusterState.metadata.indices[index.id].settings['index.number_of_shards'];
                index.numreplicas = clusterState.metadata.indices[index.id].settings['index.number_of_replicas'];
                index.status = clusterState.metadata.indices[index.id].state;
                if (index.docs == undefined) {
                    index.docs = {num_docs:0};
                }
                indices.push(index);
            }

            // look for closed indices and append to bottom of arr
            try {
                var blocks = clusterState.blocks.indices;
                var blockKeys = _.keys(blocks);
                for (var $i = 0; $i < blockKeys.length; $i++) {
                    var index = {};
                    index.id = blockKeys[$i];
                    index.name = uppercaseFirst(blockKeys[$i]);
                    index.docs = {num_docs:0};
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
                    indices:indices
                }));

            $("[rel=popRight]").popover();

            $("#indicesTable").tablesorter({ sortList:[
                [1, 1]
            ] });

            return this;
        }
    }
);