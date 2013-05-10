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
 * Serves as our mem state/persistence for all things related to the current cluster.
 * @type {*}
 */
var Cluster = Backbone.Model.extend({
    defaults:{
        connectionRootURL:undefined,
        clusterHealth:undefined,
        nodeList:undefined,
        connected:false,
        nodeStats:undefined, // the current node selected for a live feed.
        nodeInfo:undefined // the current node selected for a live feed.
    },
    initialize:function (args) {
        var _this = this;
        // test connection
        console.log(args.connectionRootURL);
        var ping = new Ping({connectionRootURL:args.connectionRootURL});
        ping.fetch({
            success:function (model, response) {
                console.log('Successful connect!');
            }
        });
        _this.initModel(args.connectionRootURL); // init cluster objects
    },
    initModel:function (conn) {
        var _this = this;
        _this.set({connected:true});
        _this.set({connectionRootURL:conn});
        _this.set({clusterHealth:new ClusterHealth({connectionRootURL:conn})});
        var nodelistmodel = new NodeListModel();
        nodelistmodel.setConnectionRootURL(conn);
        _this.set({nodeList:nodelistmodel});
    },
    fetch:function (options) {
        console.log('Fetching ClusterHealth');
        ajaxloading.show();
        this.constructor.__super__.fetch.apply(this, arguments);
    }
});