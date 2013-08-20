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

var settingsTemplate = {};

settingsTemplate.init = [
    '<div class="span10 center-table">',

    '<form class="form-horizontal" id="editSettingsForm">',

    '<fieldset>',
    '<div id="legend">',
    '<legend class="">Edit Settings</legend>',
    '</div>',

/*    '<table class="table table-bordered table-striped">',
    '<tbody>',
    '<tr>',
    '<td><label for="clusterPoller"><strong>Cluster Auto-Refresh</strong></label></td>',
    '<td>',*/
    //'<div class="input-append pull-right">',
//    '<div class="">',
    '<label for="clusterPoller"><strong>Cluster Auto-Refresh</strong></label>',
    '<input value="<%- clusterPoller %>" type="text" id="clusterPoller" name="clusterPoller" placeholder="" class="input-xlarge"  data-error-style="inline">',
    //'<span class="add-on">ms.</span>',
//    '</div>',
//    '</td>',
//    '<td>Polling frequency (in milliseconds) used on the main Cluster Overview page.</td>',
//    '</tr>',

/*    '<tr>',
    '<td><label for="nodeDiagnostics"><strong>Node Diagnostics Auto-Refresh</strong></label></td>',
    '<td>',
    '<div class="input-append pull-right">',
    '<input value="<%- settings.poller.nodeDiagnostics %>" type="text" id="nodeDiagnostics" name="nodeDiagnostics" placeholder="" class="input-mini"  data-error-style="inline">',
    '<span class="add-on">ms.</span>',
    '</div>',
    '</td>',
    '<td>Polling frequency (in milliseconds) used on the Node Diagnostics page.</td>',
    '</tr>',

    '<tr>',
    '<td><label for="node"><strong>Node Auto-Refresh</strong></label></td>',
    '<td>',
    '<div class="input-append pull-right">',
    '<input value="<%- settings.poller.node %>" type="text" id="node" name="node" placeholder="" class="input-mini"  data-error-style="inline">',
    '<span class="add-on">ms.</span>',
    '</div>',
    '</td>',
    '<td>Polling frequency used on individual Node monitoring pages.</td>',
    '</tr>',

    '<tr>',
    '<td><label for="indices"><strong>Indices List Auto-Refresh</strong></label></td>',
    '<td>',
    '<div class="input-append pull-right">',
    '<input value="<%- settings.poller.indices %>" type="text" id="indices" name="indices" placeholder="" class="input-mini"  data-error-style="inline">',
    '<span class="add-on">ms.</span>',
    '</div>',
    '</td>',
    '<td>Polling frequency for Indices list page.</td>',
    '</tr>',

    '<tr>',
    '<td><label for="index"><strong>Index Auto-Refresh</strong></label></td>',
    '<td>',
    '<div class="input-append pull-right">',
    '<input value="<%- settings.poller.index %>" type="text" id="index" name="index" placeholder="" class="input-mini"  data-error-style="inline">',
    '<span class="add-on">ms.</span>',
    '</div>',
    '</td>',
    '<td>Polling frequency for individual Index monitoring page.</td>',
    '</tr>',

    '<tr>',
    '<td><label for="debugMode"><strong>Debug Mode</strong></label></td>',
    '<td>',
    '<div class="controls">',
    '<label class="radio inline">',
    '<input type="radio" name="debugMode" id="optionsRadios1" value="option1" checked>',
    'On',
    '</label>',
    '<label class="radio inline">',
    '<input type="radio" name="debugMode" id="optionsRadios2" value="option2">',
    'Off',
    '</label>',
    '</div>',
    '</td>',
    '<td>Will print debug messages to browser console.</td>',
    '</tr>',*/

/*    '</tbody>',
    '</table>',*/

    //'<div class="control-group">',
    '<div class="row-fluid text-center">',
    '<button type="submit" id="editSettingsSubmit" class="btn btn-success">Save</button>',
    '</div>',
    //'</div>',

    '</fieldset>',
    '</form>',

    '</div>'
].join("\n");