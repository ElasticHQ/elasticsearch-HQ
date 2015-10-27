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
 Following the backbone vernacular. This obj simply handles the draw on the upper main screen.
 */
var ClusterHealthView = Backbone.View.extend({
    initialize:function (args) {
        this.stateModel = args.stateModel;
        this.indexModel = args.indexModel;
    },
    events:{
        "click #clusterHealthButton":"clicked"
    },
    clicked:function (e) {
        this.renderWorkspace();
    },
    renderWorkspace:function () {
        var clusterHealth = this.model;

        if (this.stateModel === undefined) {
            this.stateModel = cluster.get("clusterState");
        }
        if (this.indexModel === undefined) {
            this.indexModel = cluster.get("indexStats");
        }

        var indices = {};
        indices.shards = this.indexModel.get('_shards');
        if (jQuery.isEmptyObject(this.indexModel.get('_all'))) {
            indices.docs = {};
        }
        else {
            indices.docs = this.indexModel.get('_all').primaries.docs;
        }
        if (indices.docs === undefined) {
            indices.docs = {};
            indices.docs.count = 0;
        }
        indices.store = this.indexModel.get('_all').primaries.store;
        if (indices.store === undefined) {
            indices.store = {};
            indices.store.size = 0;
            indices.store.size_in_bytes = 0;
        }

        var indexKeys = _.keys(this.indexModel.get('indices'));
        if (indexKeys !== undefined) {
            indices.count = indexKeys.length;
        }
        else {
            indices.count = 0;
        }
        var metaIndices = this.stateModel.get('metadata').indices.twitter;
        var indexValues = _.values(this.indexModel.get('indices'));
        for (var i = 0; i < indexKeys.length; i++) {
            indexValues[i].id = indexKeys[i];
        }

        indices.indices = [];
        for (var $i = 0; $i < indexValues.length; $i++) {
            var index = indexValues[$i];
            index.name = index.id;
            if (versionUtil.isNewer("0.99.0", cluster.versionNumber.concat)) {
                index.numshards = this.stateModel.get('metadata').indices[index.id].settings.index.number_of_shards;
                index.numreplicas = this.stateModel.get('metadata').indices[index.id].settings.index.number_of_replicas;
            }
            else {
                index.numshards = this.stateModel.get('metadata').indices[index.id].settings['index.number_of_shards'];
                index.numreplicas = this.stateModel.get('metadata').indices[index.id].settings['index.number_of_replicas'];
            }
            index.status = this.stateModel.get('metadata').indices[index.id].state;
            if (index.docs === undefined) {
                index.docs = {num_docs:0};
            }
            indices.indices.push(index);
        }

        var template = _.template(clusterTemplate.HealthDescribe, {
            health:clusterHealth.attributes,
            state:this.stateModel,
            indices:indices,
            polling:settingsModel.get('settings').poller.cluster,
            lastUpdateTime:timeUtil.lastUpdated()
        });
        $('#workspace').html(template);

        $("[rel=tipRight]").tooltip();

        return this;
    },
    render:function () {
        var clusterHealth = this.model;
        console.log('Drawing clusterHealth ' + clusterHealth.get('cluster_name'));
        if (clusterHealth) {
            var status = clusterHealth.get('status');
            if (status == 'yellow') {
                clusterHealth.set({statusClass:'warning'});
                clusterHealth.set({statusClassLabel:'warning'});
                clusterHealth.set({statusText:'Yellow'});
            }
            else if (status == 'green') {
                clusterHealth.set({statusClass:'success'});
                clusterHealth.set({statusClassLabel:'success'});
                clusterHealth.set({statusText:'Green'});
            }
            else if (status == 'red') {
                clusterHealth.set({statusClass:'danger'});
                clusterHealth.set({statusClassLabel:'important'});
                clusterHealth.set({statusText:'Red'});
            }
            var t = _.template(clusterTemplate.Health);
            $(this.el).html(t(clusterHealth.attributes));

            //this.renderWorkspace();

            $("[rel=popRight]").popover({});
        }
        return this;
    },
    stateModel:undefined
});
