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

var QueryUtil =
{
    /**
     * Builds a request body for the search POST
     * @param queryModel
     * @return {*}
     */
    buildBody:function (queryModel, from) {

        if (queryModel.queryString === '') {
            return {
                "from":from,
                "size":queryModel.get('queryObj').size,
                "sort":queryModel.get('queryObj').sort,
                "fields":queryModel.get('queryObj').fields,
                "explain":true
            };
            //, "sort":[ {"_id":{"order":"asc" }}], "version":true, "fields":["_parent","_source"],"query":{"bool":{"must":[],"must_not":[],"should":[{"match_all":{}}]}} };
        }
        else {
            queryModel.get('queryObj').query.filtered.query.query_string.query = queryModel.queryString;
            queryModel.get('queryObj').from = from;
            return queryModel.toJSON().queryObj;
        }
    }
};