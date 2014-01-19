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

var mapRoute = {};

mapRoute.createMapping = function () {
    var createTypeModel = new MappingSimple({connectionRootURL:cluster.get("connectionRootURL")});
    if (this.createTypeView === undefined) {
        this.createTypeView = new CreateTypeView({model:createTypeModel});
    }
    this.createTypeView.render();
};

mapRoute.deleteMapType = function (indexId, mappingName) {
    var mappingModel = new MappingSimple({connectionRootURL:cluster.get("connectionRootURL"), indexId:indexId, mappingName:mappingName});
    mappingModel.id = indexId;
    mappingModel.destroy({
        success:function (model, response) {
            $('#deletemappingmodal').modal('hide');
            $('#deletemappingmodal').on('hidden', function () {
                router.navigate("mappings", true);
            });
        },
        error:function (model, response, options) {
            $('#deletemappingmodal').modal('hide');
            $('#deletemappingmodal').on('hidden', function () {
                router.navigate("mappings", true);
            });
        }
    });
};

mapRoute.viewMappings = function (indexId, mappingName) {
    var mappingModel = new MappingsModelFactory().create();
    if (indexId === undefined && mappingName === undefined) { // list all mapping types
        mappingModel.setConnectionRootURL(cluster.get("connectionRootURL"));
        mappingModel.fetch({
            success:function (model, response) {
                var mappingView = new MappingListView({model:mappingModel});
                mappingView.render();
            },
            error:function () {
// TODO
            }
        });
    } else {
        mappingModel = new MappingSimple({connectionRootURL:cluster.get("connectionRootURL"), indexId:indexId, mappingName:mappingName});
        mappingModel.fetch({
            success:function (model, response) {
                var mappingView = new MapTypeViewFactory().create({model:mappingModel});
                mappingView.render();
            }
        });
    }
};