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

var QueryModel = Backbone.Model.extend({
    defaults:{
        indexCSV:undefined,
        indicesArray:undefined,
        queryString:undefined,
        queryObj:{
            "query":{
                "filtered":{
                    "query":{
                        "query_string":{
                            "query":""
                        }
                    }
                }
            },
            "fields" : null,
            "from":0,
            "size":10,
            "sort":[
                {
                    "_score":{"order":"asc" }
                }
            ],
            "explain":true
        }
    },
    initialize:function (args) {
        console.log("Inside QueryModel");

        this.indexCSV = args.indexCSV;
        this.indicesArray = args.indicesArray;
        this.queryString = args.queryString;
    },
    url:function () {
        return '/' + this.indexCSV + '/_search';
    },
    getInstanceURL:function () {
        return cluster.get("connectionRootURL") + '/' + this.indexCSV + '/_search';
    }
});