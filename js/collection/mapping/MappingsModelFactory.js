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
function MappingsModelFactory() {
    this.create = function () {
        var _this = this;
        if (versionUtil.isNewer("0.99.0", cluster.versionNumber.concat)) {
//            MappingsModel.prototype = new MappingsModel();
            var model = new MappingsModel(); //{
            //MappingsModel.prototype.parse = function (data) {
            model.parse = function (data) {
                var mappings = [];

                // indices are keyed by their id, so we need to get the key and add it to the value object foreach
                //var indices = data.indices;
                var indexKeys = _.keys(data);
                var indexValues = _.values(data);
                for (var i = 0; i < indexKeys.length; i++) {
                    var indexName = indexKeys[i];
                    var mapArr = _.keys(indexValues[i]);
                    var mapVArr = _.values(indexValues[i]);
                    for (var j = 0; j < mapArr.length; j++) {
                        if (mapArr[j] == 'mappings') {
                            var mappingKeys = _.keys(mapVArr[j]);
                            var mappingValues = _.values(mapVArr[j]);
                            for (var k = 0; k < mappingKeys.length; k++) {
                                var simpleMapping = new MappingSimple();
                                simpleMapping.indexId = indexName;
                                simpleMapping.mappingName = mappingKeys[k];
                                simpleMapping.properties = mappingValues[k].properties;
                                mappings.push(simpleMapping);
                            }
                        }
                    }
                }
                return mappings;
            };
            //return MappingsModel.prototype;
            return model;
        }
        else {
            return  new MappingsModel();
        }
    }
};
