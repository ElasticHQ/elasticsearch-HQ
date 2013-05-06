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

 http://localhost:9200/_cluster/nodes
 */

/*****
 * TODO: accept params for url.
 * settings, os, process, jvm, thread_pool, network, transport, http and plugin, all
 * @type {*}
 */
var NodeInfosListModel = Backbone.Collection.extend({
    model:NodeSimple,
    initialize:function () {
        console.log("Inside NodeInfosList");
    },
    url:function () {
        return '/_cluster/nodes'
    }/*,
     parse:function (data) {
     if (data.master_node) {
     console.log('Master Node is: ' + data.master_node);
     this.masterNode = data.master_node;
     }

     // nodes are keyed by their id, so we need to get the key and add it to the value object foreach
     var nodes = data.nodes;
     nodes[this.masterNode].master = true; // all the others appear as false, by default.
     nodes = _.sortBy(nodes, function (node) { // put masternode first in line
     return node.master;
     });
     var nodeKeys = _.keys(nodes);
     var nodeValues = _.values(nodes);
     for (var i = 0; i < nodeKeys.length; i++) {
     nodeValues[i].id = nodeKeys[i];
     }

     return nodeValues;
     }*/
});
