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

var visualRoute = {};

visualRoute.init = function () {

    var clusterStateModel = new ClusterState({connectionRootURL:cluster.get("connectionRootURL")});
    clusterStateModel.fetch(
        {
            success:function (model, response) {
                var visualView = new VisualView({model:clusterStateModel});
                visualView.render();
            },
            error:function (model, response, options) {
                var err = 'Unable to Read Cluster State! ';
                console.log('Error! ' + err);
                show_stack_bottomright({type:'error', title:'Fetch Failed', text:err, hide:false, closer_hover:false});
            }
        });
};

visualRoute.doFilter= function () {
    // get checked checkboxes and query string
    var indices = [];
    $('#vcheckboxindices input:checked').each(function () {
        indices.push($(this).attr('name'));
    });

    var clusterStateModel = new ClusterState({connectionRootURL:cluster.get("connectionRootURL")});
    clusterStateModel.fetch(
        {
            success:function (model, response) {
                var visualView = new VisualView({model:clusterStateModel, indicesArray: indices});
                visualView.render();
            },
            error:function (model, response, options) {
                var err = 'Unable to Read Cluster State! ';
                console.log('Error! ' + err);
                show_stack_bottomright({type:'error', title:'Fetch Failed', text:err, hide:false, closer_hover:false});
            }
        });
};
