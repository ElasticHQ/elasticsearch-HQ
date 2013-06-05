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

var RESTModel = Backbone.Model.extend({
    defaults:{
        cmd:undefined
    },
    initialize:function (args) {
        if (args.cmd != undefined) {
            this.cmd = args.cmd;
        }
    },
    url:function () {
        if (this.cmd == 'health') {
            return '/_cluster/health';
        }
        else if (this.cmd == 'state') {
            return '/_cluster/state';
        }
        else if (this.cmd == 'ping') {
            return '/';
        }
        else if (this.cmd == 'nodeinfo') {
            return '/_cluster/nodes';
        }
        else if (this.cmd == 'nodestats') {
            return '/_cluster/nodes/stats';
        }
        else {
            return '/';
        }
    }
});