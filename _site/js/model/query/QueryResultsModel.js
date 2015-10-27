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
 * The main object returned on query results. Includes a results array that points to a collection of @see QueryResultModel objects
 * @type {*}
 */
var QueryResultsListModel = Backbone.Model.extend({
    defaults:{
        totalHits:0,
        maxScore:0,
        timeOut:false,
        responseTime:0,
        results:[]
    },
    initialize:function (args) {
    }
});
