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

var restRoute = {};

restRoute.view = function () {
    var restView = new RESTView({});
    restView.render();
};

restRoute.editorView = function () {
    var jsoneditorView = new JSONEditorView();
    jsoneditorView.render();
};

restRoute.doEditorQuery = function () {

    var action = $('#jsonformaction option:selected').val();
    var endpoint = $('#jsonformendpoint option:selected').val();

    // prep model., we dont use backbone connection in this case.
    var jsonapiModel = new JSONAPIModel({action:action, endpoint:endpoint});

    // issue jquery ajax POST then render
    var jsoneditorpostView = new JSONEditorPostView({model:jsonapiModel});
    jsoneditorpostView.render();
};

restRoute.json = function (command) {
    if (command == 'cputhreads') {
        window.open(cluster.get("connectionRootURL") + '/_nodes/hot_threads?type=cpu&threads=10', '_blank');
        return;
    }
    else if (command == 'blockthreads') {
        window.open(cluster.get("connectionRootURL") + '/_nodes/hot_threads?type=block&threads=10', '_blank');
        return;
    }
    else if (command == 'waitthreads') {
        window.open(cluster.get("connectionRootURL") + '/_nodes/hot_threads?type=wait&threads=10', '_blank');
        return;
    }

    var restModel = new RESTModelFactory().create(command);
    restModel.fetch({
        success:function (model, response) {
            var str = JSON.stringify(response, undefined, 2);
            var restView = new RESTJSONView({model:restModel, res:str});
            restView.render();
        },
        error:function (model, response, options) {
            var str = JSON.stringify(response, undefined, 2);
            var template = _.template(restTemplate.JSONView, {title:'Error!', res:str});
            $('#workspace').html(template);
            prettyPrint();
        }
    });
};