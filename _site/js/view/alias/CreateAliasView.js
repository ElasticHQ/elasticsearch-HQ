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

var CreateAliasView = Backbone.View.extend(
    {
        el:$('#workspace'), // must be explicitly set for event binding to work!
        events:{
            'click #createAliasSubmit':'saveToModel'
        },
        initialize:function (args) {
            this.indexId = args.indexId;
        },
        saveToModel:function (e) {
            e.preventDefault();

            var data = this.$('#createAliasForm').serializeObject();
            this.model.set(data);
            var _this = this;
            this.model.indexId = undefined; // have to set undefined so it uses the POST url

            // this triggers a RESTFul POST (or PUT) request to the URL specified in the model
            this.model.save(
                {
                    "actions":[
                        {
                            "add":{
                                "index":_this.model.get('indexId'),
                                "alias":_this.model.get('aliasId'),
                                "search_routing":_this.model.get('search_routing') || undefined,
                                "index_routing":_this.model.get('index_routing') || undefined
                            }
                        }
                    ]
                },
                {
                    success:function (model, response) {
                        Backbone.history.navigate('index/' + _this.model.get('indexId'), true);

                        show_stack_bottomright({type:'success', title:'Alias Created', text:'"' + _this.model.get('aliasId') + '" created.'});
                    },
                    error:function (model, response, options) {
                        {
                            var err = '<p>Server Response is...</p><pre class="prettyprint language-json">' + response.responseText + '</pre>';
                            show_stack_bottomright({type:'error', title:'Alias Failed', text:err, hide:false, closer_hover:false});
                            prettyPrint();
                            Backbone.history.navigate('index/' + _this.model.get('indexId'), true);

                        }
                    }
                }
            );
            this.unbind();
            this.model.unbind("#createAliasSubmit", this.render);

            Backbone.history.navigate('index/' + this.indexId, true);

            return false;
        },
        render:function () {
            var _this = this;

            var tpl = _.template(indexActionTemplate.createAlias);
            $('#workspace').html(tpl(
                {
                    indexId:_this.indexId,
                    indexName:_this.indexId,
                    model:_this.model
                }));

            Backbone.Validation.bind(this);
            return this;
        },
        onClose:function () {
            this.model.unbind("#createAliasSubmit", this.render);
        },
        indexId:undefined
    });