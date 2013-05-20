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

var CreateIndexView = Backbone.View.extend(
    {
        el:$('#workspace'), // must be explicitly set for event binding to work!
        events:{
            'submit #createIndexForm':'saveToModel'
        },
        initialize:function () {
            // ...
        },
        saveToModel:function (data) {
            this.model.indexId = '411';

            // this triggers a RESTFul POST (or PUT) request to the URL specified in the model
            this.model.save(
                {
                    "settings":{
                        "number_of_shards":3,
                        "number_of_replicas":2
                    }
                },
                {
                    success:function (model, response) {
                        Backbone.history.navigate('indices', true);
                    }
                }
            );

            return false;
        },
        render:function () {
            var template = _.template(indexActionTemplate.createIndex, {model:this.model});
            $('#workspace').html(template);
            return this;
        }
    });