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

/****
 * $ curl -XGET 'http://localhost:9200/_cluster/health?pretty=true'
 {
   "cluster_name" : "testcluster",
   "status" : "green",
   "timed_out" : false,
   "number_of_nodes" : 2,
   "number_of_data_nodes" : 2,
   "active_primary_shards" : 5,
   "active_shards" : 10,
   "relocating_shards" : 0,
   "initializing_shards" : 0,
   "unassigned_shards" : 0
 }
 * @type {*}
 */
var ClusterHealth = Backbone.Model.extend({
    initialize:function () {
        console.log("Inside ClusterHealth");
    },
    url:function () {
        return '/_cluster/health';
    }
});