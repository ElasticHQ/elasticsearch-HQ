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


var SettingsModel = Backbone.Model.extend({
    defaults:{
        hqversion:HQVERSION,
        settings:{
            uuid:null,
            poller:{
                cluster:10000,
                nodeDiagnostics:30000,
                node:10000,
                indices:15000,
                index:10000
            },
            debugMode:0
        }
    },
    initialize:function () {
        console.log("Init Settings Model");
        this.loadFromStorage();
    },
    url:function () {
        return '/';
    },
    loadFromStorage:function () {
        if (localStorage) {
            var settings = localStorage.getItem("hqsettings");
            if (settings != undefined) {
                this.buildSettings($.parseJSON(settings));
                this.saveToStorage(); // make sure any future additions are saved.
            }
            else // if no settings, save the defaults for now.
            {
                this.saveToStorage();
            }
        }
    },
    /**
     * Returns the settings object.
     * @return {*}
     */
    getSettings:function () {
        return this.get('settings');
    },
    saveToStorage:function () {
        // sanity check (mostly because of null fields)
        this.buildSettings(this.getSettings());

        localStorage.setItem('hqsettings', JSON.stringify(this.getSettings()));
    },
    /**
     * Builds the this.settings object. optimized for future compatibility
     * @param settingsArg
     */
    buildSettings:function (settingsArg) {
        this.get('settings').uuid = (settingsArg.uuid != null) ? settingsArg.uuid : guid.generateGUID();
        if (settingsArg.poller == undefined) {
            settingsArg.poller = {};
        }
        this.get('settings').debugMode = (settingsArg.debugMode != undefined) ? settingsArg.debugMode : this.get('settings').debugMode;
        this.get('settings').poller.cluster = (settingsArg.poller.cluster != undefined) ? settingsArg.poller.cluster : this.get('settings').poller.cluster;
        this.get('settings').poller.nodeDiagnostics = (settingsArg.poller.nodeDiagnostics != undefined) ? settingsArg.poller.nodeDiagnostics : this.get('settings').poller.nodeDiagnostics;
        this.get('settings').poller.node = (settingsArg.poller.node != undefined) ? settingsArg.poller.node : this.get('settings').poller.node;
        this.get('settings').poller.indices = (settingsArg.poller.indices != undefined) ? settingsArg.poller.indices : this.get('settings').poller.indices;
        this.get('settings').poller.index = (settingsArg.poller.index != undefined) ? settingsArg.poller.index : this.get('settings').poller.index;
    },
    validation:{/*
        'settings.poller.cluster':{
            required:true,
            min:1,
            max:5,
            pattern:'number',
            msg:'Please enter a # value.'
        },*/
        clusterPoller : {
            required:true,
            min:1,
            max:5,
            pattern:'number',
            msg:'Please enter a # value.'
        }
    }
});