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

var clusterRoute = {};

clusterRoute.cluster = function () {
    // break apart the poller for the main menu/nodelist and the cluster-overview screen...
    var healthModel = cluster.get("clusterHealth");

    healthModel.fetch({
        success:function () {

            // BEGIN: INIT: we only do these things on successful connect...
            checkVersion();

//            $("#settings").css("visibility", "visible");

            activateLogging();
            // END: INIT

            var polloptions = {delay:10000};
            mainMenuPoller = Backbone.Poller.get(healthModel, polloptions);
            mainMenuPoller.start();

            mainMenuPoller.on('success', function (healthModel) {
                var clusterView = new ClusterHealthView({el:$("#clusterHealth-loc"), model:healthModel});
                clusterView.render();

                $("#toolbar").css("visibility", "visible");

                var nodeList = cluster.get("nodeList");
                var existingListSize = _.size(nodeList);
                nodeList.fetch(
                    {
                        success:function (model, response) {
                            console.log('Node List retrieved');
                            if (existingListSize != _.size(model.models)) {
                                var nodeListView = new NodeListView({el:$("#nodeList-loc"), model:nodeList});
                                nodeListView.render();
                                console.log('Node List updated');
                            }
                            else {
                                console.log('Node List eq. Nothing to update.');
                            }
                        },
                        error:function (model, response, options) {
                            var err = 'Unable to Read Node List! ';
                            console.log('Error! ' + err);
                            var errModel = new ErrorMessageModel({warningTitle:'Error!', warningMessage:err});
                            var errorMsgView = new ErrorMessageView({el:$("#error-loc"), model:errModel});
                            errorMsgView.render();
                        }
                    }
                );
            });
            mainMenuPoller.on('error', function (healthModel, response) {
                var err = 'Unable to Connect to Server! Connection broken, or server has gone away. Please reconnect.';
                console.log('Error! ' + err);
                var errModel = new ErrorMessageModel({warningTitle:'Error!', warningMessage:err});
                var errorMsgView = new ErrorMessageView({el:$("#error-loc"), model:errModel});
                errorMsgView.render();

                // update cluster button
                healthModel.attributes.status = 'red';
                var clusterView = new ClusterHealthView({el:$("#clusterHealth-loc"), model:healthModel});
                clusterView.render();
                $("#toolbar").css("visibility", "hidden");

                // update nodes view.
                var nodeListView = new NodeListView({el:$("#nodeList-loc"), model:[]});
                nodeListView.render();

            });

            /* cluster workspace */
            var clusterState = cluster.get("clusterState");
            clusterState.fetch({
                success:function () {
                    clusterOverviewPoller = Backbone.Poller.get(clusterState, {delay:settingsModel.get('settings').poller.cluster});
                    clusterOverviewPoller.start();

                    clusterOverviewPoller.on('success', function (clusterState) {
                        ajaxloading.show();
                        $.when(cluster.get("indexStats").fetch())
                            .done(function () {
                                var clusterView = new ClusterHealthView(
                                    {
                                        model:healthModel,
                                        stateModel:cluster.get("clusterState"),
                                        indexModel:cluster.get("indexStats")
                                    });
                                clusterView.renderWorkspace();

                                // Once the initial cluster workspace is drawn, post stats data - only once per connect.
                                if (!postedStatsData && !settingsModel.get('settings').optoutStats) {
                                    postedStatsData = true;
                                    var statsModel = new StatsModel();

                                }
                            });
                        ajaxloading.hide();
                    });
                }
            });
            //show_stack_bottomright({type:'info', title:'Tip', text:'Cluster Overview refreshes every 5 seconds.'});
        },
        error:function (model, response) {
            var err = 'Unable to Connect to Server! ';
            if (response) {
                err += 'Received Status Code: ' + response.status + '.';
                if (response.status === 0) {
                    err += " A status code of 0, could mean the host is unreacheable or nothing is listening on the given port.";
                }
            }
            console.log('Error! ' + err);
            var errModel = new ErrorMessageModel({warningTitle:'Error!', warningMessage:err});
            var errorMsgView = new ErrorMessageView({el:$("#error-loc"), model:errModel});
            errorMsgView.render();
        }
    });
};