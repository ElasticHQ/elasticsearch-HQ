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

/***
 * Abandon all hope, ye who enters here.
 *
 * @param indexId
 */
indexRoute.indexView = function (indexId) {
    var indexStatsModel = new IndexStatsModel({connectionRootURL:cluster.get("connectionRootURL"), indexId:indexId});
    var indexStatusModel = new IndexStatusModel({connectionRootURL:cluster.get("connectionRootURL"), indexId:indexId});
    var indexHealthModel = new IndexHealthModel({connectionRootURL:cluster.get("connectionRootURL"), indexId:indexId});
    var indexAliasModel = new IndexAliasModel({connectionRootURL:cluster.get("connectionRootURL"), indexId:indexId});

    indexStatusModel.fetch({
        success:function (model, response) {

            var polloptions = {delay:settingsModel.get('settings').poller.index};
            indexPoller = Backbone.Poller.get(indexStatusModel, polloptions);
            indexPoller.start();
            indexPoller.on('success', function (indexStatusModel) {
                ajaxloading.show();
                $.when(indexStatsModel.fetch(), indexHealthModel.fetch(), indexAliasModel.fetch())
                    .done(function () {
                        var indexView = new IndexView({indexId:indexId, model:indexStatsModel, statusModel:indexStatusModel, healthModel:indexHealthModel, aliasModel:indexAliasModel});
                        indexView.render();
                    });
                ajaxloading.hide();
            });
        }
    });
};

indexRoute.deleteIndex = function (indexId) {
    var indexModel = new IndexModel({connectionRootURL:cluster.get("connectionRootURL"), indexId:indexId});
    indexModel.id = indexId;
    indexModel.destroy({
        success:function (model, response) {
            var str = JSON.stringify(response, undefined, 2);
            var template = _.template(indexActionTemplate.defaultModal, {title:'Index Deleted!', res:str});
            $('#infoModal-loc').html(template);
            prettyPrint();
            $('#deleteindexmodal').modal('hide');
            $('#deleteindexmodal').on('hidden', function () {
                $('#defaultindexmodal').modal('show');
                $('#defaultindexmodal').on('hidden', function () {
                    router.navigate("indices", true);
                });
            });
        },
        error:function (model, response, options) {
            var str = JSON.stringify(response, undefined, 2);
            var template = _.template(indexActionTemplate.defaultModal, {title:'Index Delete Failed!', res:str});
            $('#infoModal-loc').html(template);
            prettyPrint();
            $('#deleteindexmodal').modal('hide');
            $('#deleteindexmodal').on('hidden', function () {
                $('#defaultindexmodal').modal('show');
                $('#defaultindexmodal').on('hidden', function () {
                    router.navigate("indices", true);
                });
            });
        }
    });

};

indexRoute.openIndex = function (indexId) {
    var indexModel = new IndexModel({connectionRootURL:cluster.get("connectionRootURL"), indexId:indexId, cmd:'_open'});
    indexModel.save({}, {
        success:function (model, response) {
            var str = JSON.stringify(response, undefined, 2);
            var template = _.template(indexActionTemplate.defaultModal, {title:'Index Opened for Business!', res:str});
            $('#infoModal-loc').html(template);
            prettyPrint();
            $('#defaultindexmodal').modal('show');
            var clusterState = cluster.get("clusterState");
            clusterState.fetch({
                success:function () {
                    $('#defaultindexmodal').on('hidden', function () {
                        router.navigate("indices", true);
                    });
                }
            });
        },
        error:function (model, response, options) {
            var str = JSON.stringify(response, undefined, 2);
            var template = _.template(indexActionTemplate.defaultModal, {title:'Index Open Failed!', res:str});
            $('#infoModal-loc').html(template);
            prettyPrint();
            $('#defaultindexmodal').modal('show');
            $('#defaultindexmodal').on('hidden', function () {
                router.navigate("indices", true);
            });
        }
    });
};

indexRoute.closeIndex = function (indexId) {
    var indexModel = new IndexModel({connectionRootURL:cluster.get("connectionRootURL"), indexId:indexId, cmd:'_close'});
    indexModel.save({}, {
        success:function (model, response) {
            var str = JSON.stringify(response, undefined, 2);
            var template = _.template(indexActionTemplate.defaultModal, {title:'Index Closed!', res:str});
            $('#infoModal-loc').html(template);
            prettyPrint();
            $('#defaultindexmodal').modal('show');

            var clusterState = cluster.get("clusterState");
            clusterState.fetch({
                success:function () {
                    $('#defaultindexmodal').on('hidden', function () {
                        router.navigate("indices", true);
                    });
                }
            });
        },
        error:function (model, response, options) {
            var str = JSON.stringify(response, undefined, 2);
            var template = _.template(indexActionTemplate.defaultModal, {title:'Index Close Failed!', res:str});
            $('#infoModal-loc').html(template);
            prettyPrint();
            $('#defaultindexmodal').modal('show');
            $('#defaultindexmodal').on('hidden', function () {
                router.navigate("indices", true);
            });
        }
    });
};

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
            $('#defaultindexmodal').modal('show');
        }
    });
};

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
            $('#defaultindexmodal').modal('show');
        }
    });
};

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
            $('#defaultindexmodal').modal('show');
        }
    });
};

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
            $('#defaultindexmodal').modal('show');
        }
    });
};