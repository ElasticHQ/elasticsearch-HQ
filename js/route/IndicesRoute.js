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

var indicesRoute = {};


indicesRoute.refreshAll = function (indexId) {
    var refreshAllModel = new RefreshAllIndex({connectionRootURL:cluster.get("connectionRootURL")});
    refreshAllModel.fetch({
        success:function (model, response) {
            var str = JSON.stringify(response, undefined, 2);
            var template = _.template(indexActionTemplate.defaultModal, {title:'A Refreshing Change!', res:str});
            $('#infoModal-loc').html(template);
            prettyPrint();
            $('#defaultindexmodal').modal('show');
            $('#defaultindexmodal').on('hidden', function () {
                router.navigate("indices", true);
            });
        },
        error:function () {
            var str = JSON.stringify(response, undefined, 2);
            var template = _.template(indexActionTemplate.defaultModal, {title:'Refresh Failed!', res:str});
            $('#infoModal-loc').html(template);
            prettyPrint();
            $('#defaultindexmodal').modal('show');
            $('#defaultindexmodal').on('hidden', function () {
                router.navigate("indices", true);
            });
        }
    });
};
