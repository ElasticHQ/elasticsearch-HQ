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

var indexRoute = {};


indexRoute.deleteIndex = function (indexId) {
    var indexModel = new IndexModel({connectionRootURL:cluster.get("connectionRootURL"), indexId:indexId});
    indexModel.id = indexId;
    indexModel.destroy({
        success:function (model, response) {
            var str = JSON.stringify(response, undefined, 2);
            var template = _.template(indexActionTemplate.defaultModal, {title:'Index Deleted!', res:str});
            $('#infoModal-loc').html(template);
            prettyPrint();
            $('#defaultindexmodal').modal('show');
            $('#defaultindexmodal').on('hidden', function () {
                router.navigate("indices", true);
            });
        },
        error:function (model, response, options) {
            var str = JSON.stringify(response, undefined, 2);
            var template = _.template(indexActionTemplate.defaultModal, {title:'Index Delete Failed!', res:str});
            $('#infoModal-loc').html(template);
            prettyPrint();
            $('#defaultindexmodal').modal('show');
            $('#defaultindexmodal').on('hidden', function () {
                router.navigate("indices", true);
            });
        }
    });

}

indexRoute.flushIndex = function (indexId) {
    var indexModel = new IndexModel({connectionRootURL:cluster.get("connectionRootURL"), indexId:indexId, cmd:'_flush'});
    indexModel.fetch({
        success:function (model, response) {
            var str = JSON.stringify(response, undefined, 2);
            var template = _.template(indexActionTemplate.defaultModal, {title:'Index Flushed!', res:str});
            $('#infoModal-loc').html(template);
            prettyPrint();
            $('#defaultindexmodal').modal('show');
        },
        error:function (model, response, options) {
            var str = JSON.stringify(response, undefined, 2);
            var template = _.template(indexActionTemplate.defaultModal, {title:'Index Flush Failed!', res:str});
            $('#infoModal-loc').html(template);
            prettyPrint();
            $('#deleteindexmodal').modal('show');
        }
    });
}

indexRoute.refreshIndex = function (indexId) {
    var indexModel = new IndexModel({connectionRootURL:cluster.get("connectionRootURL"), indexId:indexId, cmd:'_refresh'});
    indexModel.fetch({
        success:function (model, response) {
            var str = JSON.stringify(response, undefined, 2);
            var template = _.template(indexActionTemplate.defaultModal, {title:'Index Refreshed!', res:str});
            $('#infoModal-loc').html(template);
            prettyPrint();
            $('#defaultindexmodal').modal('show');
        },
        error:function (model, response, options) {
            var str = JSON.stringify(response, undefined, 2);
            var template = _.template(indexActionTemplate.defaultModal, {title:'Index Refresh Failed!', res:str});
            $('#infoModal-loc').html(template);
            prettyPrint();
            $('#deleteindexmodal').modal('show');
        }
    });
}

indexRoute.optimizeIndex = function (indexId) {
    var indexModel = new IndexModel({connectionRootURL:cluster.get("connectionRootURL"), indexId:indexId, cmd:'_optimize'});
    indexModel.fetch({
        success:function (model, response) {
            var str = JSON.stringify(response, undefined, 2);
            var template = _.template(indexActionTemplate.defaultModal, {title:'Index Optimized!', res:str});
            $('#infoModal-loc').html(template);
            prettyPrint();
            $('#defaultindexmodal').modal('show');
        },
        error:function (model, response, options) {
            var str = JSON.stringify(response, undefined, 2);
            var template = _.template(indexActionTemplate.defaultModal, {title:'Index Optimization Failed!', res:str});
            $('#infoModal-loc').html(template);
            prettyPrint();
            $('#deleteindexmodal').modal('show');
        }
    });
}

indexRoute.clearCacheIndex = function (indexId) {
    var indexModel = new IndexModel({connectionRootURL:cluster.get("connectionRootURL"), indexId:indexId, cmd:'_cache/clear'});
    indexModel.fetch({
        success:function (model, response) {
            var str = JSON.stringify(response, undefined, 2);
            var template = _.template(indexActionTemplate.defaultModal, {title:'Index Cache Cleared!', res:str});
            $('#infoModal-loc').html(template);
            prettyPrint();
            $('#defaultindexmodal').modal('show');
        },
        error:function (model, response, options) {
            var str = JSON.stringify(response, undefined, 2);
            var template = _.template(indexActionTemplate.defaultModal, {title:'Clear Cache Failed!', res:str});
            $('#infoModal-loc').html(template);
            prettyPrint();
            $('#deleteindexmodal').modal('show');
        }
    });
}