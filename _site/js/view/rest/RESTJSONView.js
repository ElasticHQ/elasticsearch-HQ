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
            var url = _this.model.get('connectionRootURL') + _this.model.fetchURL;
            var template = _.template(restTemplate.JSONView, {title:title, res:_this.str, fetchURL:url});
            $('#workspace').html(template);
            $("[rel=tipRight]").tooltip();
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
            else if (_this.model.cmd == 'indexaliases') {
                return 'Indices Aliases';
            }
            else if (_this.model.cmd == 'indexsettings') {
                return 'Indices Settings';
            }
            else if (_this.model.cmd == 'indexstats') {
                return 'Indices Stats';
            }
            else if (_this.model.cmd == 'indexstatus') {
                return 'Indices Status';
            }
            else if (_this.model.cmd == 'indexsegments') {
                return 'Indices Segments';
            }
            else if (_this.model.cmd == 'indexmappings') {
                return 'All Mappings';
            }
            else if (_this.model.cmd == 'indexrefresh') {
                return 'Indices Refresh Scheduled';
            }
            else if (_this.model.cmd == 'indexflush') {
                return 'Indices Flushed';
            }
            else if (_this.model.cmd == 'indexoptimize') {
                return 'Indices Optimized';
            }
            else if (_this.model.cmd == 'indexclearcache') {
                return 'Indices Cache Cleared';
            }
            else if (_this.model.cmd == 'cluster_settings') {
                return 'Cluster Settings';
            }

        },
        str:undefined,
        title:undefined
    });