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
 * $ curl -XPUT 'http://localhost:9200/twitter/' -d '{
    "settings" : {
        "number_of_shards" : 3,
        "number_of_replicas" : 2
    }
}'
 /*
 * Generic class symbolizing an Index. Used for creating and performing actions (cmd) on an index. We
 * do not use this for loading an Index, however. Loading an index view is far more complicated so we use
 * status and stats classes for that.
 * @type {*}
 */
var IndexModel = Backbone.Model.extend({
    defaults:{
        indexId:undefined,
        cmd:undefined
    },
    initialize:function (args) {
        console.log("Creating Index " + args.indexId);
        this.indexId = args.indexId;
        if (args.cmd !== undefined) {
            this.cmd = args.cmd;
        }
    },
    url:function () {
        if (this.cmd !== undefined) {
            return '/' + this.indexId + '/' + this.cmd;
        }
        else {
            return '/' + this.indexId;
        }

    },
    validation:{
        indexId:{
            required:true,
            msg:'Please enter a valid Index ID'
        }/*,
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
         }*/
    }
});