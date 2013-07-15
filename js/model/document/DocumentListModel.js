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
 http://www.elasticsearch.org/guide/reference/api/search/

 http://localhost:9200/comicbook/_search

 {    "query": {
        "filtered" : {
            "query" : {
                "query_string" : {
                    "query" : "hulk"
                }
            }
        }
    },
"sort" : { "_id" : { "order" : "asc"} }

}
 */

var DocumentList = Backbone.Collection.extend({
    model:Document,
    initialize:function (args) {
        console.log("Inside DocumentList");
    },
    url:function () {
        return '/_cluster/state?filter_nodes=false&filter_metadata=true&filter_routing_table=true&filter_blocks=true&filter_indices=true'
    },
    parse:function (data) {

    }
});