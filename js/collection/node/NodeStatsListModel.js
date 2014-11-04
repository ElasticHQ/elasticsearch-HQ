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

 http://localhost:9200/_cluster/nodes/XXX/stats
 */

/*****
 * settings, os, process, jvm, thread_pool, network, transport, http and plugin, all
 * @type {*}
 */
var NodeStatsListModel = Backbone.Model.extend({//Backbone.Collection.extend({
    defaults:{
        selectedNodes:undefined
    },
    initialize:function () {
        console.log("Inside NodeStatsListModel");
    },
    url:function () {
        var sNodes = this.get('selectedNodes');
        if (sNodes == undefined || sNodes.length == 0) {
            return '/_cluster/nodes/stats?all=1';
        }
        else {
            var nodes = '';
            for (var i = 0; i < sNodes.length; i++) {
                nodes = nodes + sNodes[i];
                if (sNodes.length - 1 > i) {
                    nodes = nodes + ',';
                }
            }
            return '/_cluster/nodes/' + nodes + '/stats?all=1';
        }
        //return '/_nodes/stats?clear=true&os=false'; // test for incomplete dataset returns from server.
    },
    fetch:function (options) {
        ajaxloading.show();
        this.constructor.__super__.fetch.apply(this, arguments);
    }
});
