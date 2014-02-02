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
 * Override for breaking change in v1.0.0RC1: http://www.elasticsearch.org/guide/en/elasticsearch/reference/master/_indices_apis.html
 * @constructor
 *
 * {
   "comicbook": {
      "mappings": {
         "male": {
            "properties": {
               "name": {
                  "type": "string",
                  "store": true
               }
            }
         },
         "superhero": {
            "properties": {
               "name": {
                  "type": "string"
               },
               "summary": {
                  "type": "string"
               }
            }
         }
      }
   }
}
 */
function MapTypeViewFactory() {
    this.create = function (model) {
        if (versionUtil.isNewer("0.99.0", cluster.versionNumber.concat)) {
            var mapTypeView = new MapTypeView({model:model});
            mapTypeView.render = function () {
                var _mapping = this.model.model.toJSON();

                var mapType = {};

                mapType.indexId = _mapping.indexId;
                mapType.mappingName = _mapping.mappingName;
                var props = _mapping[_mapping.indexId].mappings[_mapping.mappingName].properties;
                var template = _.template(mappingTemplate.mapView, {props:props, mapType:mapType});
                $('#workspace').html(template);
                $("[rel=popRight]").popover();
            };
            return mapTypeView;
        }
        else {
            return new MapTypeView({model:model});
        }
    }
}