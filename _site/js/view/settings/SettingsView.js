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
        el:$('#workspace'), // must be explicitly set for event binding to work!
        events:{
            'click #editSettingsSubmit':'saveToModel'
        },
        saveToModel:function (e) {
            e.preventDefault();

            var data = this.$('#editSettingsForm').serializeObject();
            try { // functions below are only here to trigger validation. useless otherwise
                this.model.set(data);
                this.model.save({});
            }
            catch (x) {
                //
            }

            if (this.model.isValid()) {
                this.model = settingsModel;
                this.model.get('settings').poller.cluster = data.clusterPoller;
                this.model.get('settings').poller.nodeDiagnostics = data.ndPoller;
                this.model.get('settings').poller.node = data.nPoller;
                this.model.get('settings').poller.indices = data.indicesPoller;
                this.model.get('settings').poller.index = data.indexPoller;
                this.model.get('settings').nodeDiagnosticsMax = data.nodeDiagnosticsMax;
                this.model.get('settings').debugMode = (data.debugMode !== undefined) ? 1 : 0;
                this.model.get('settings').optoutStats = (data.optoutStats !== undefined) ? true : false;
                this.model.saveToStorage();

                settingsModel = settingsModel.loadFromStorage();

                var tpl = _.template(settingsTemplate.saved);
                $('#savedSettings').html(tpl(
                    { }));
            }

            this.unbind();
            this.model.unbind("#editSettingsSubmit", this.render);


            return false;
        },
        render:function () {
            var _this = this;

            var tpl = _.template(settingsTemplate.init);
            $('#workspace').html(tpl(
                {
                    settings:_this.model.get('settings')
                }));

            Backbone.Validation.bind(this);
            return this;
        },
        onClose:function () {
            this.model.unbind("#editSettingsSubmit", this.render);
        }
    }
);