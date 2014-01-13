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
            nodeDiagnosticsMax:10,
            debugMode:0,
            optoutStats:false
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
            if (settings !== undefined && settings != "undefined") {
                this.buildSettings($.parseJSON(settings));
                this.saveToStorage(); // make sure any future additions are saved.
            }
            else // if no settings, save the defaults for now.
            {
                this.saveToStorage();
            }
            return this;
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

        try {
            localStorage.setItem('hqsettings', JSON.stringify(this.getSettings()));
        }
        catch (e) {
            console.log('Unable to save settings in local storage. ' + e.message);
        }
    },
    /**
     * Builds the this.settings object. optimized for future compatibility
     * @param settingsArg
     */
    buildSettings:function (settingsArg) {
        try {
            this.get('settings').uuid = (settingsArg.uuid != null) ? settingsArg.uuid : guid.generateGUID();
            if (settingsArg.poller === undefined) {
                settingsArg.poller = {};
            }
            this.get('settings').debugMode = (settingsArg.debugMode !== undefined) ? settingsArg.debugMode : this.get('settings').debugMode;
            this.get('settings').nodeDiagnosticsMax = (settingsArg.nodeDiagnosticsMax !== undefined) ? settingsArg.nodeDiagnosticsMax : this.get('settings').nodeDiagnosticsMax;
            this.get('settings').optoutStats = (settingsArg.optoutStats !== undefined) ? settingsArg.optoutStats : this.get('settings').optoutStats;
            this.get('settings').poller.cluster = (settingsArg.poller.cluster !== undefined) ? settingsArg.poller.cluster : this.get('settings').poller.cluster;
            this.get('settings').poller.nodeDiagnostics = (settingsArg.poller.nodeDiagnostics !== undefined) ? settingsArg.poller.nodeDiagnostics : this.get('settings').poller.nodeDiagnostics;
            this.get('settings').poller.node = (settingsArg.poller.node !== undefined) ? settingsArg.poller.node : this.get('settings').poller.node;
            this.get('settings').poller.indices = (settingsArg.poller.indices !== undefined) ? settingsArg.poller.indices : this.get('settings').poller.indices;
            this.get('settings').poller.index = (settingsArg.poller.index !== undefined) ? settingsArg.poller.index : this.get('settings').poller.index;
        }
        catch (e) {
            console.log('Cannot build settings object. Using defaults. ' + e.message);
        }
    },
    validation:{
        clusterPoller:{
            required:true,
            range:[POLLER_MIN_FREQUENCY, POLLER_MAX_FREQUENCY],
            pattern:'number',
            msg:'Acceptable Range is ' + POLLER_MIN_FREQUENCY + ' to ' + POLLER_MAX_FREQUENCY
        },
        ndPoller:{
            required:true,
            range:[POLLER_MIN_FREQUENCY, POLLER_MAX_FREQUENCY],
            pattern:'number',
            msg:'Acceptable Range is ' + POLLER_MIN_FREQUENCY + ' to ' + POLLER_MAX_FREQUENCY
        },
        nPoller:{
            required:true,
            range:[POLLER_MIN_FREQUENCY, POLLER_MAX_FREQUENCY],
            pattern:'number',
            msg:'Acceptable Range is ' + POLLER_MIN_FREQUENCY + ' to ' + POLLER_MAX_FREQUENCY
        },
        indicesPoller:{
            required:true,
            range:[POLLER_MIN_FREQUENCY, POLLER_MAX_FREQUENCY],
            pattern:'number',
            msg:'Acceptable Range is ' + POLLER_MIN_FREQUENCY + ' to ' + POLLER_MAX_FREQUENCY
        },
        indexPoller:{
            required:true,
            range:[POLLER_MIN_FREQUENCY, POLLER_MAX_FREQUENCY],
            pattern:'number',
            msg:'Acceptable Range is ' + POLLER_MIN_FREQUENCY + ' to ' + POLLER_MAX_FREQUENCY
        },
        nodeDiagnosticsMax:{
            required:true,
            range:[1, 200],
            pattern:'number',
            msg:'Acceptable Range is 1 to 200'
        }
    }
});