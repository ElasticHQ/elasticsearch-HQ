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
 * Override backbone base model and provides util functions.
 *
 * Override:
 * 1/ Specifically for dealing with root URL we need to override the base sync. This is the only method that seems to work...
 * From: http://stackoverflow.com/questions/9925105/how-to-set-custom-base-href-in-backbone
 *
 * @type {*}
 */
Backbone.Model = Backbone.Model.extend({
    sync:function (method, model, options) {
        var url = _.isFunction(model.url) ? model.url() : model.url;

        if (url) {  // If no url, don't override, let Backbone.sync do its normal fail
            options = options || {};
            options.url = this.get('connectionRootURL') + url;
        }

        // override for auth credentials being passed in URLs
        try {
            var token = tokenizeUserPassFromURL(options.url);
            if (token !== undefined) {
                options.beforeSend = function (xhr) {
                    xhr.setRequestHeader('Authorization', ("Basic ".concat(btoa(token))));
                };
            }
        }
        catch (e) {
            console.log('Could not parse URL for auth credentials! ' + e.message);
        }

        return Backbone.sync(method, model, options);
    },
    initialize:function (attributes, options) {
        if (options && options.connectionRootURL) {
            this.setConnectionRootURL(options.connectionRootURL);
        }
    }
});

/*
 Difference with collections, is that we need to explicitly get/set the params.
 */
Backbone.Collection = Backbone.Collection.extend({
    sync:function (method, model, options) {
        var url = _.isFunction(model.url) ? model.url() : model.url;

        if (url) {  // If no url, don't override, let Backbone.sync do its normal fail
            options = options || {};
            options.url = this.getConnectionRootURL() + url;
        }

        // override for auth credentials being passed in URLs
        try {
            var token = tokenizeUserPassFromURL(options.url);
            if (token !== undefined) {
                options.beforeSend = function (xhr) {
                    xhr.setRequestHeader('Authorization', ("Basic ".concat(btoa(token))));
                };
            }
        }
        catch (e) {
            console.log('Could not parse URL for auth credentials! ' + e.message);
        }

        return Backbone.sync(method, model, options);
    },
    initialize:function (attributes, options) {
        if (options && options.connectionRootURL) {
            this.setConnectionRootURL(options.connectionRootURL);
        }
    },
    getConnectionRootURL:function () {
        return this.connectionRootURL;
    },
    setConnectionRootURL:function (url) {
        this.connectionRootURL = url;
    }
});