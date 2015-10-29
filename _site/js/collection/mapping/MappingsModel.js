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

var MappingsModel = Backbone.Collection.extend({
    model:MappingSimple,
    url:function () {
        return '/_mapping';
    },
    parse:function (data) {
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
                var simpleMapping = new MappingSimple();
                simpleMapping.indexId = indexName;
                simpleMapping.mappingName = mapArr[j];/*
                if (mapVArr[j] == 'mappings') { // stupid v1.0.0 change
                    console.log(_.keys(mapVArr[j]));
                }*/
                simpleMapping.properties = mapVArr[j].properties;
                mappings.push(simpleMapping);
            }
        }
        return mappings;
    }
});