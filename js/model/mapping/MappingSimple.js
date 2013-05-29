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

var MappingSimple = Backbone.Model.extend({
    defaults:{
        indexId:undefined,
        mappingName:undefined,
        properties:{}
    },
    initialize:function (args) {
        if (args) {
            this.indexId = args.indexId;
            this.mappingName = args.mappingName;
        }
    },
    url:function () {
        return '/' + this.indexId + '/' + this.mappingName + '/_mapping';
    }
});

/*,
 validation:{
 indexId:{
 required:true,
 msg:'Please enter a valid Index ID'
 },
 shards:{
 required:true,
 min:1,
 pattern:'number',
 msg:'Please enter a # value.'
 },
 replicas:{
 required:true,
 min:0,
 pattern:'number',
 msg:'Please enter a # value.'
 }
 }*/