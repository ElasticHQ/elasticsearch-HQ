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

var RESTJSONView = Backbone.View.extend(
    {
        initialize:function (args) {
            this.str = args.res;
            this.title = args.title;
        },
        render:function () {
            var _this = this;
            var title = this.getTitle(_this.title);

            var template = _.template(restTemplate.JSONView, {title:title, res:_this.str});
            $('#workspace').html(template);
            prettyPrint();
            return this;
        },
        getTitle:function () {
            var _this = this;
            if (_this.model.cmd == 'health') {
                return 'Cluster Health';
            }
            else if (_this.model.cmd == 'state') {
                return 'Cluster State';
            }
            else if (_this.model.cmd == 'ping') {
                return 'Ping';
            }
            else if (_this.model.cmd == 'nodeinfo') {
                return 'Node Information';
            }
            else if (_this.model.cmd == 'nodestats') {
                return 'Node Statistics';
            }

        },
        str:undefined,
        title:undefined
    });