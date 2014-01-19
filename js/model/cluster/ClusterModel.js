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

/**
 * Serves as our mem state/persistence for all things related to the current cluster.
 * @type {*}
 */
var Cluster = Backbone.Model.extend({
    defaults:{
        versionNumber:{
            concat:undefined,
            major:undefined,
            minor:undefined,
            rev:undefined
        },
        connectionRootURL:undefined,
        clusterHealth:undefined,
        clusterState:undefined,
        nodeList:undefined,
        connected:false,
        nodeStats:undefined, // the current node selected for a live feed.
        nodeInfo:undefined, // the current node selected for a live feed.
        indexStats:undefined //
    },
    initialize:function (args) {
        var _this = this;
        // test connection
        console.log(args.connectionRootURL);
        var ping = new Ping({connectionRootURL:args.connectionRootURL});
        ping.fetch({
            success:function (model, response) {
                console.log('Successful connect!');

                $.cookie("resturl", args.connectionRootURL, { expires:7, path:'/' });

                var version = ping.get("version");
                if (!version) {
                    version = {};
                    version.number = "0.99.0";
                }

                if (version && version.number) {
                    _this.setVersionNumber(version.number);
                    _this.supportedVersion(version.number);
                }
                //show_stack_bottomright({type:'info', title:'Tip', text:'ElasticHQ will refresh the Node List every 10 seconds.'});
                //show_stack_bottomright({type:'success', title:'Successful Connect!', text:'Connection to cluster has been established.'});
            },
            error:function (model, response, options) {
                console.log('Failed to Connect on Ping!');
                show_stack_bottomright({type:'error', title:'Failed to Connect!', text:'Connection to cluster could not be established.'});
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
                return;
            }
        });
        _this.initModel(args.connectionRootURL); // init cluster objects
    },
    setVersionNumber:function (versionNumber) {
        var _this = this;

        //versionNumber = versionNumber.replace(/\D/g, '');
        var versionArr = versionNumber.split(".");
        _this.versionNumber = {
            major:versionArr[0],
            minor:versionArr[1],
            rev:versionArr[2],
            concat:versionArr[0] + "." + versionArr[1] + "." + versionArr[2]
        };
        //console.log(versionUtil.isNewer("1.0.0", versionNumber));
    },
    supportedVersion:function (versionNumber) {
        var versionArr = versionNumber.split(".");
        if (versionArr[0] >= 0 && versionArr[1] >= 90) {
            //show_stack_bottomright({type:'success', title:'Version Check', text:'ES Version supported: ' + versionNumber + '.'});
        }
        else if (versionArr[0] >= 1 && versionArr[1] >= 0) {
            //show_stack_bottomright({type:'success', title:'Version Check', text:'ES Version supported: ' + versionNumber + '.'});
        }
        else {
            show_stack_bottomright({type:'warning', title:'Version Warning!', text:'ElasticHQ may not work with version ' + versionNumber + '. Tested on 0.90.0-1.0.0.'});
        }
    },
    initModel:function (conn) {
        var _this = this;
        _this.set({connected:true});
        _this.set({connectionRootURL:conn});
        _this.set({clusterHealth:new ClusterHealth({connectionRootURL:conn})});
        _this.set({clusterState:new ClusterState({connectionRootURL:conn})});
        _this.set({indexStats:new IndexStatsModel({connectionRootURL:conn})});
        var nodelistmodel = new NodeListModel();
        nodelistmodel.setConnectionRootURL(conn);
        _this.set({nodeList:nodelistmodel});
    },
    fetch:function (options) {
        console.log('Fetching ClusterHealth');
        ajaxloading.show();
        this.constructor.__super__.fetch.apply(this, arguments);
    },
    refreshClusterState:function () {
        var _this = this;
        _this.get("clusterState").fetch({
            success:function (model, res) {
                _this.set({clusterState:model});
            }
        });
    }
});