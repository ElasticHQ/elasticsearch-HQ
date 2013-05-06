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
var debugMode = 1;

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

        // bind click even on connect button
        connectButton.click(function () {
            // TODO: change in url should clear many of the templates.
            $("#error-loc").empty();
            connect(connectionURL.val());
        });

        var connect = function (connectionURL) {
            var clusterHealth = new ClusterHealth({connectionRootURL:connectionURL});
            clusterHealth.fetch({
                success:function (healthModel, response) {
                    var clusterName = healthModel.get("cluster_name");
                    console.log('Connected to: ' + clusterName);
                    var clusterView = new ClusterHealthView({el:$("#clusterHealth-loc"), model:healthModel});
                    clusterView.render();

                    // now call for cluster state for node data...
                    console.log(connectionURL);
                    var nodeList = new NodeListModel();
                    nodeList.setConnectionRootURL(connectionURL);
                    nodeList.fetch(
                        {
                            success:function (model, response) {
                                console.log('Node List retrieved');
                                var nodeListView = new NodeListView({el:$("#nodeList-loc"), model:nodeList});
                                nodeListView.render();
                            },
                            error:function (model, response, options) {
// TODO
                            }
                        }
                    );
                },
                error:function (model, response, options) {
                    var err = 'Unable to Connect to Server! ';
                    if (response) {
                        err += 'Received Status Code: ' + response.status;
                    }
                    console.log('Error! ' + err);
                    var errModel = new ErrorMessageModel({warningTitle:'Error!', warningMessage:err});
                    var errorMsgView = new ErrorMessageView({el:$("#error-loc"), model:errModel});
                    errorMsgView.render();
                }
            });
        }
    });
