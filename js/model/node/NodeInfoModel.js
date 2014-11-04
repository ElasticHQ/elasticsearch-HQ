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

var NodeInfoModel = Backbone.Model.extend({
    defaults:{
        nodeId:undefined
    },
    initialize:function (args) {
        console.log("Inside NodeInfoModel");
        this.nodeId = args.nodeId;
    },
    url:function () {
        if (this.nodeId) {
            return '/_cluster/nodes/' + this.nodeId + '?all=true';
            // 100rc1 return '/_nodes/' + this.nodeId + '?all=true';
        }
        else {
            return '/_cluster/nodes?all=true';
            //100rc1 return '/_nodes?all=true';
        }
    }

});