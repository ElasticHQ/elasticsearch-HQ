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

settingsTemplate.saved = [
    '<div class="alert alert-success lead">',
    '<i class="icon-info-sign icon-large"></i> Settings Saved Successully! ',
    '<button type="button" class="close" data-dismiss="alert">&times;</button>',
    '</div>'
].join("\n");

settingsTemplate.init = [

    '<div class="span10 center-table">',

    '<div id="savedSettings"></div>',

    '<form class="form-horizontal" id="editSettingsForm">',
    '<fieldset>',
    '<div id="legend">',
    '<legend class="">Edit Settings</legend>',
    '</div>',

    '<table class="table table-bordered table-striped">',
    '<tbody>',
    '<tr>',
    '<td style="white-space: nowrap;"><label for="clusterPoller"><strong>Cluster Auto-Refresh</strong></label></td>',
    '<td>',
    '<div class="input-append">',
    '<div class="control-group">',
    '<div class="controls">',
    '<input type="text" value="<%- settings.poller.cluster %>" id="clusterPoller" name="clusterPoller" placeholder="" class="input"  data-error-style="tooltip">',
    '<span class="add-on">ms.</span>',
    '</div>',
    '</div>',
    '</div>',
    '</td>',
    '<td>Polling frequency used on the main Cluster Overview page.</td>',
    '</tr>',

    '<tr>',
    '<td style="white-space: nowrap;"><label for="ndPoller"><strong>Node Diagnostics Auto-Refresh</strong></label></td>',
    '<td>',
    '<div class="input-append">',
    '<div class="control-group">',
    '<div class="controls">',
    '<input type="text" value="<%- settings.poller.nodeDiagnostics %>" id="ndPoller" name="ndPoller" placeholder="" class="input"  data-error-style="tooltip">',
    '<span class="add-on">ms.</span>',
    '</div>',
    '</div>',
    '</div>',
    '</td>',
    '<td>Polling frequency used on the Node Diagnostics page.</td>',
    '</tr>',

    '<tr>',
    '<td style="white-space: nowrap;"><label for="nPoller"><strong>Node Monitoring Auto-Refresh</strong></label></td>',
    '<td>',
    '<div class="input-append">',
    '<div class="control-group">',
    '<div class="controls">',
    '<input type="text" value="<%- settings.poller.node %>" id="nPoller" name="nPoller" placeholder="" class="input"  data-error-style="tooltip">',
    '<span class="add-on">ms.</span>',
    '</div>',
    '</div>',
    '</div>',
    '</td>',
    '<td>Polling frequency used on the Node Diagnostics page.</td>',
    '</tr>',

    '<tr>',
    '<td style="white-space: nowrap;"><label for="indicesPoller"><strong>Indices Auto-Refresh</strong></label></td>',
    '<td>',
    '<div class="input-append">',
    '<div class="control-group">',
    '<div class="controls">',
    '<input type="text" value="<%- settings.poller.indices %>" id="indicesPoller" name="indicesPoller" placeholder="" class="input"  data-error-style="tooltip">',
    '<span class="add-on">ms.</span>',
    '</div>',
    '</div>',
    '</div>',
    '</td>',
    '<td>Polling frequency used on the Indices List page.</td>',
    '</tr>',

    '<tr>',
    '<td style="white-space: nowrap;"><label for="indexPoller"><strong>Index Monitoring Auto-Refresh</strong></label></td>',
    '<td>',
    '<div class="input-append">',
    '<div class="control-group">',
    '<div class="controls">',
    '<input type="text" value="<%- settings.poller.index %>" id="indexPoller" name="indexPoller" placeholder="" class="input"  data-error-style="tooltip">',
    '<span class="add-on">ms.</span>',
    '</div>',
    '</div>',
    '</div>',
    '</td>',
    '<td>Polling frequency used on the Index Monitoring page.</td>',
    '</tr>',

    '<tr>',
    '<td><label for="debugMode"><strong>Debug Mode</strong></label></td>',
    '<td>',
    '<div class="controls">',
    '<label class="checkbox">',
    '<% if ( settings.debugMode == 1) { %>',
    '<input type="checkbox" value="on" checked id="debugMode" name="debugMode"> Log all messages to Console',
    '<% } else { %>',
    '<input type="checkbox" value="on" id="debugMode" name="debugMode"> Log all messages to Console',
    '<% } %>',
    '</label>',
    '</div>',
    '</td>',
    '<td>Will print debug messages to browser console.</td>',
    '</tr>',

    '<tr>',
    '<td style="white-space: nowrap;"><label for="uuid"><strong>User ID</strong></label></td>',
    '<td>',
    '<div class="">',
    '<div class="control-group">',
    '<div class="controls">',
    '<input type="text" value="<%- settings.uuid %>" id="uuid" name="uuid" placeholder="" class="input" disabled>',
    '</div>',
    '</div>',
    '</div>',
    '</td>',
    '<td>Your unique User ID.</td>',
    '</tr>',


    '</tbody>',
    '</table>',

    '</fieldset>',

    '<div class="pull-right control-group">',
    '<div class="controls">',
    '<button type="submit" id="editSettingsSubmit" class="btn btn-success">Save Settings</button>',
    '</div>',
    '</div>',

    '</form>',

    '</div>'
].join("\n");