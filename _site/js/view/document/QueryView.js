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
 * Initial query UI view. Performs binding and display, but does not display results.
 * @type {*}
 */
var QueryView = Backbone.View.extend({
    initialize:function () {
    },
    render:function () {

        var indices = _.keys(this.model);
        var fields = [];

        var types = ["_score", "_type", "_uid"];
        try {
            for (var $i = 0; $i < indices.length; $i++) {
                var mappingTypeKeys = _.keys(_.values(this.model)[$i].mappings);
                var mappingTypeVals = _.values(_.values(this.model)[$i].mappings);
                if (mappingTypeKeys !== undefined) {
                    for (var $j = 0; $j < mappingTypeKeys.length; $j++) {
                        if (mappingTypeVals[$j] !== undefined) {
                            var prop = mappingTypeVals[$j].properties;
                            if (prop !== undefined) {
                                var tempTypes = _.keys(prop);
                                for (var $k = 0; $k < tempTypes.length; $k++) {
                                    if (!_.contains(types, tempTypes[$k])) {
                                        types.push(tempTypes[$k]);
                                        fields.push(tempTypes[$k]);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        } catch (e) {
            console.log(e.message);
        }

        var tpl = _.template(queryTemplate.view);
        $('#workspace').html(tpl({
            indices:indices,
            fields: fields,
            types:types
        }));

        $('#queryString').bind('focus', doFocus('#queryString', '#querySubmit'), false);
        $("#queryString").focus();

        $("#querySubmit").click(function () {
            queryRoute.doQuery();
        });

        $("[rel=tipRight]").tooltip();
        $('.selectpicker').selectpicker();

        $('#toggleIndex').bind('click', function(e) {
            e.preventDefault();
            var isChecked = $(this).hasClass('checked');

            if(isChecked){
                $(this).removeClass('checked');
                $(this).find('i').removeClass('icon-check').addClass('icon-check-empty');
            }else{
                $(this).addClass('checked');
                $(this).find('i').removeClass('icon-check-empty').addClass('icon-check');
            }

            $('#checkboxindices li label input[type="checkbox"]').prop('checked', !isChecked);
        });

        $('#toggleFields').bind('click', function(e) {
            e.preventDefault();
            var isChecked = $(this).hasClass('checked');

            if(isChecked){
                $(this).removeClass('checked');
                $(this).find('i').removeClass('icon-check').addClass('icon-check-empty');
            }else{
                $(this).addClass('checked');
                $(this).find('i').removeClass('icon-check-empty').addClass('icon-check');
            }

            $('#checkboxfields li label input[type="checkbox"]').prop('checked', !isChecked);
        });

        return this;
    }
});