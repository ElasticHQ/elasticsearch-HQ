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

var SnapShotView = Backbone.View.extend(
    {
//        clusterStateModel:undefined,
        initialize:function (args) {
//            this.clusterStateModel = args.clusterStateModel;
        },
        render:function () {
            var tpl = _.template(snapShotTemplate.init);
            $('#workspace').html(tpl(
                {
                }));

            $("[rel=tipRight]").tooltip();

            return this;
        }
    }
);