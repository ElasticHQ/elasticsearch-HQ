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
 * Initial query UI view. Performs binding and display, but does not display results.
 * @type {*}
 */
var QueryView = Backbone.View.extend({
    initialize:function () {
    },
    render:function () {

        var indices = _.keys(this.model); // TODO: this object holds mapping and document information for filtering feature later on.

        var tpl = _.template(queryTemplate.view);
        $('#workspace').html(tpl({
            indices:indices
        }));

        $("#querySubmit").click(function () {
            queryRoute.doQuery();
        });

        $("[rel=tipRight]").tooltip();

        return this;
    }
});