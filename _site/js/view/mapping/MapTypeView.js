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

var MapTypeView = Backbone.View.extend(
    {
        initialize:function (args) {
        },
        render:function () {
            var _this = this;
            var _mapping = _this.model.toJSON();

            var mapType = {};

            mapType.indexId = _mapping.indexId;
            mapType.mappingName = _mapping.mappingName;
            var props = _mapping[_mapping.mappingName].properties;

            var template = _.template(mappingTemplate.mapView, {props:props, mapType:mapType});
            $('#workspace').html(template);
            $("[rel=popRight]").popover();
        }
    });