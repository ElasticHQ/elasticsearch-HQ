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

// log =1, no-log =0.
var debugMode = 0;

var cluster; // globally available cluster object maintains state of models and connection url.
$(document).ready(
    function ($) {

        if (debugMode == 1) {
            logger.enableLogger()
        }
        else {
            logger.disableLogger();
        }

        var connectButton = $('#connectButton');
        var connectionURL = $('#connectionURL');

        // check for plugin mode
        // plugin takes precedence over cookie
        if (window.location.href.indexOf("/_plugin/") != -1) {
            connectionURL = window.location.protocol + "//" + window.location.host;
            $('#connectionURL').val(connectionURL);
        }
        else {
            var cookieURL = $.cookie('resturl');
            if (cookieURL != undefined) {
                $('#connectionURL').val(cookieURL);
            }
        }

        // bind click even on connect button
        connectButton.click(function () {
            $("#error-loc").empty();
            doConnect($('#connectionURL').val());
        });

/*        connectionURL.keypress(function(e) {
            // Enter pressed?
            if(e.which == 10 || e.which == 13) {
                doConnect($('#connectionURL').val());
            }
        });*/

    });

var doConnect = function (connectionRootURL) {

    cluster = new Cluster({connectionRootURL:connectionRootURL});

    router.navigate();
    router.navigate("cluster", true);
};