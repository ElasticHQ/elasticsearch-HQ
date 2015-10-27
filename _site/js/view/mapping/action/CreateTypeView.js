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

var CreateTypeView = Backbone.View.extend(
    {
        el:$('#workspace'), // must be explicitly set for event binding to work!
        events:{
            'submit':'saveToModel'
        },
        saveToModel:function (e) {
            e.preventDefault();

            var _this = this;
            var data = this.$('#createTypeForm').serializeObject();
            this.model.set(data);
            this.model.indexId = data.indexId.toLowerCase();


            // this triggers a RESTFul POST (or PUT) request to the URL specified in the model
            this.model.save(
                {
                    "settings":{
                        "number_of_shards":data.shards,
                        "number_of_replicas":data.replicas
                    }
                },
                {
                    success:function (model, response) {
                        Backbone.history.navigate('indices', true);
                        show_stack_bottomright({type:'success', title:'Index Created', text:'"' + _this.model.indexId + '" index created.'});
                    },
                    error:function (model, response, options) {
                        {
                            var err = '<p>Server Response is...</p><pre class="prettyprint linenums language-json">' + response.responseText + '</pre>';
                            show_stack_bottomright({type:'error', title:'Index Failed', text:err, hide:false, closer_hover:false});
                            prettyPrint();
                            Backbone.history.navigate('indices', true);
                        }
                    }
                }
            );
            this.unbind();

            return false;
        },
        render:function () {
            var template = _.template(mappingTemplate.createType, {model:this.model});
            $('#workspace').html(template);
            Backbone.Validation.bind(this);
            //this.model.on('validated:valid', this.valid, this);
            //this.model.on('validated:invalid', this.invalid, this);
            return this;
        },
        onClose:function () {
            this.model.unbind("submit", this.render);
        }
    });