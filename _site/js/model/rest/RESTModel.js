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
        fetchURL:undefined,
        cmd:undefined
    },
    initialize:function (args) {
        if (args.cmd !== undefined) {
            this.cmd = args.cmd;
        }
    },
    url:function () {
        if (this.cmd == 'health') {
            this.fetchURL = '/_cluster/health';
        }
        else if (this.cmd == 'state') {
            this.fetchURL = '/_cluster/state';
        }
        else if (this.cmd == 'cluster_settings') {
            this.fetchURL = '/_cluster/settings';
        }
        else if (this.cmd == 'ping') {
            this.fetchURL = '/';
        }
        else if (this.cmd == 'nodeinfo') {
            this.fetchURL = '/_cluster/nodes?all=true';
        }
        else if (this.cmd == 'nodestats') {
            this.fetchURL = '/_cluster/nodes/stats?all=true';
        }
        else if (this.cmd == 'indexaliases') {
            this.fetchURL = '/_aliases';
        }
        else if (this.cmd == 'indexsettings') {
            this.fetchURL = '/_settings';
        }
        else if (this.cmd == 'indexstats') {
            this.fetchURL = '/_stats?all=true';
        }
        else if (this.cmd == 'indexstatus') {
            this.fetchURL = '/_status';
        }
        else if (this.cmd == 'indexsegments') {
            this.fetchURL = '/_segments';
        }
        else if (this.cmd == 'indexmappings') {
            this.fetchURL = '/_mapping';
        }
        else if (this.cmd == 'indexrefresh') {
            this.fetchURL = '/_refresh';
        }
        else if (this.cmd == 'indexflush') {
            this.fetchURL = '/_flush';
        }
        else if (this.cmd == 'indexoptimize') {
            this.fetchURL = '/_optimize';
        }
        else if (this.cmd == 'indexclearcache') {
            this.fetchURL = '/_cache/clear';
        }
        else {
            this.fetchURL = '/';
        }
        return this.fetchURL;
    }
});