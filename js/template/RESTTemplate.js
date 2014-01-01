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

var restTemplate = {};

restTemplate.sideNav = [
    '<ul class="nav nav-list">',
    '<li class="nav-header">Editor</li>',
    '<li><a href="#jsoneditor"><i class="icon-double-angle-right"></i> JSON Editor</a></li>',
    '<li class="nav-header">Cluster</li>',
    '<li><a href="#restcall/health"><i class="icon-double-angle-right"></i> Health</a></li>',
    '<li><a href="#restcall/state"><i class="icon-double-angle-right"></i> State</a></li>',
    '<li><a href="#restcall/cluster_settings"><i class="icon-double-angle-right"></i> Settings</a></li>',
    '<li><a href="#restcall/ping"><i class="icon-double-angle-right"></i> Ping</a></li>',
    '<li class="nav-header">Nodes</li>',
    '<li><a href="#restcall/nodeinfo"><i class="icon-double-angle-right"></i> Info</a></li>',
    '<li><a href="#restcall/nodestats"><i class="icon-double-angle-right"></i> Stats</a></li>',
    '<li><a href="#restcall/cputhreads" rel="popRight"  data-trigger="hover"  data-title="Note..." data-html="true" data-content="The information will open in a new window."><i class="icon-double-angle-right"></i> CPU Threads</a></li>',
    '<li><a href="#restcall/waitthreads" rel="popRight"  data-trigger="hover"  data-title="Note..." data-html="true" data-content="The information will open in a new window."><i class="icon-double-angle-right"></i> Wait Threads</a></li>',
    '<li><a href="#restcall/blockthreads" rel="popRight"  data-trigger="hover"  data-title="Note..." data-html="true" data-content="The information will open in a new window."><i class="icon-double-angle-right"></i> Block Threads</a></li>',
    /*'<li class="divider"></li>',*/
    //'<li><a href="#" rel="popRight"  data-trigger="hover"  data-title="<b>WARNING!</b>" data-html="true" data-content="This command will shutdown <b>all</b> of your Nodes!"><i class="icon-cog"></i> Shutdown</a></li>',
    '<li class="nav-header">Indices</li>',
    '<li><a href="#restcall/indexaliases"><i class="icon-double-angle-right"></i> Aliases</a></li>',
    '<li><a href="#restcall/indexsettings"><i class="icon-double-angle-right"></i> Settings</a></li>',
    '<li><a href="#restcall/indexstats"><i class="icon-double-angle-right"></i> Stats</a></li>',
    '<li><a href="#restcall/indexstatus"><i class="icon-double-angle-right"></i> Status</a></li>',
    '<li><a href="#restcall/indexsegments"><i class="icon-double-angle-right"></i> Segments</a></li>',
    '<li><a href="#restcall/indexmappings"><i class="icon-double-angle-right"></i> Mappings</a></li>',
    /*'<li class="divider"></li>',*/
    '<li><a href="#restcall/indexrefresh"><i class="icon-cog"></i> Refresh</a></li>',
    '<li><a href="#restcall/indexflush"><i class="icon-cog"></i> Flush</a></li>',
    '<li><a href="#restcall/indexoptimize"><i class="icon-cog"></i> Optimize</a></li>',
    '<li><a href="#restcall/indexclearcache"><i class="icon-cog"></i> Clear Cache</a></li>',
    '</ul>'
].join('\n');

restTemplate.docsLink = [
    '<a href="http://www.elasticsearch.org/guide/reference/api/" target="_blank" class="btn btn-success pull-right">API Docs <i class="icon-external-link"></i></a>'
].join("\n");

restTemplate.mainView = [
    '<div class="span2 well sidebar-nav">',
    restTemplate.sideNav,
    '</div>',
    '<div class="span10">',
    '<div><h2>REST API UI', restTemplate.docsLink, '</h2></div>',
    '<p>Use the options on the left-hand menu to make REST API requests to your cluster. This screen will then display the JSON response.</p>',
    '<p>All commands are issued in <b>\'_all\'</b> scope; meaning that the request will <b>affect all of your nodes, indices, or mappings</b>.</p>',
    '<p>\'<i class="icon-double-angle-right"></i>\' denote requests for information. \'<i class="icon-cog"></i>\' denote commands and actions.</p>',
    //'<div class="alert alert-danger"><i class="icon-info-sign"></i> USE AT YOUR OWN RISK! Commands are sent in <strong>_all</strong> scope. For example: a \'Shutdown\' command will <strong>shutdown all of your nodes.</strong>. </div>',
    '</div>'
].join("\n");

restTemplate.JSONView = [
    '<div class="span2 well sidebar-nav">',
    restTemplate.sideNav,
    '</div>',
    '<div class="span10">',
    '<div><h2><%- title %>', restTemplate.docsLink, '</h2></div>',
    '<div style="padding-bottom: 5px;"><code><%- fetchURL %></code> ',
    '<a href="<%-fetchURL %>" target="_blank" class="btn btn-mini" rel="tipRight" data-placement="bottom" data-title="Open in New Window"><i class="icon-external-link"></i></a></div>',
    '<pre class="prettyprint linenums language-json">',
    '<%- res %>',
    '</pre>',
    '</div>'
].join("\n");

restTemplate.jsonEditorView = [
    '<div class="span12">',

    '<h2>REST Editor</h2>',

    '<form class="form-inline">',
    '<select  data-width="auto" class="selectpicker" data-container="body" id="jsonformaction">',
    '<option>GET</option>',
    '<option>POST</option>',
    /*'<option>PUT</option>',*/
    '</select>',
    '<span id="endpointSelect">',
    '</span>',
    '<button class="btn btn-success" type="button" id="jsonformsubmit"><b><i class="icon-caret-right"></i></b></button>',

    //'<span id="restHelp" class="alert alert-success pull-right"><i class="icon-question-sign"></i> Simple Heartbeat request.</span>',

    '</form>',

    //'<div class="span12">',
    '<div class="span3" style="padding: 0;margin: 0;">',
    '<pre id="jsoneditor"></pre>',
    '</div>',

    '<div class="span9">',
    '<pre id="jsonoutput"></pre>',
    '</div>',
    // '</div>',


    '</div>'
].join("\n");

restTemplate.jsonapiendpoints = [
    '<select  data-width="auto" class=" selectpicker" data-container="body" id="jsonformendpoint">',
    '<% _.each(endpoints, function(ep) { %>',
    '<optgroup label="<%- ep.key %>">',
    '<% _.each(ep.value, function(val) { %>',
    '<option><%- val %></option>',
    '<% }) %>',
    '<% }) %>',
    '</select>',
].join("\n");