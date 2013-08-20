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

var SettingsView = Backbone.View.extend(
    {
        clusterPoller: undefined,
        el:$('#workspace'), // must be explicitly set for event binding to work!
        events:{
            'click #editSettingsSubmit':'saveToModel'
        },
        initialize:function (args) {
            this.clusterPoller = args.clusterPoller;
        },
        saveToModel:function (e) {
            e.preventDefault();

            var data = this.$('#editSettingsForm').serializeObject();
            this.model.set(data);
            this.model.clusterPoller = data.clusterPoller;

            var isValid = this.model.isValid('clusterPoller');
            console.log(isValid);

            this.model.save({});

            this.unbind();
            this.model.unbind("#editSettingsSubmit", this.render);

            console.log('done!');

            return false;
        },
        render:function () {
            var _this = this;

            var tpl = _.template(settingsTemplate.init);
            $('#workspace').html(tpl(
                {
                    clusterPoller:_this.clusterPoller,
                    model:_this.model
                }));

            Backbone.Validation.bind(this);
            return this;


            /*            var tpl = _.template(settingsTemplate.init);
             $('#workspace').html(tpl(
             {
             model:this.model//.get('settings')
             }));

             Backbone.Validation.bind(this, {
             valid:function (view, attr) {
             console.log('valid');
             },
             invalid:function (view, attr, error) {
             console.log('invalid');
             }
             });

             $("[rel=tipRight]").tooltip();*/

            return this;
        },
        onClose:function () {
            this.model.unbind("#editSettingsSubmit", this.render);
        }
    }
);