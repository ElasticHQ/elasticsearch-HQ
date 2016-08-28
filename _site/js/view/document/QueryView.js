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

        var model = this.model;
        var indices = _.keys(this.model);
        var extraSortFields = ["_score", "_type", "_uid"];
        var tpl = _.template(queryTemplate.view);

        /**
         * Retrieves the types for a list of indices.
         */
        function getIndexTypes(indices)
        {
          var allTypes = [];

          if(indices == null)
          {
            return [];
          }

          for(var $i = 0; $i < indices.length; $i++) {
            var indexTypes = _.keys(model[indices[$i]].mappings);
            for(var $j = 0; $j < indexTypes.length; $j++) {
              if (!_.contains(allTypes, indexTypes[$j])) {
                allTypes.push(indexTypes[$j]);
              }
            }
          }

          return allTypes;
        }

        /**
         * Retrieves the fields for a list of indices/types.
         */
         function getFields(indices, types)
         {
           var fields = [];

           if(indices == null || types == null)
           {
             return [];
           }

           for (var $i = 0; $i < indices.length; $i++) {
             var index = indices[$i];
             for (var $j = 0; $j < types.length; $j++) {
               var type = types[$j];
               var typeFields = getIndexTypeFields(index, type);

               for (var $k = 0; $k < typeFields.length; $k++) {
                 if (!_.contains(fields, typeFields[$k])) {
                   fields.push(typeFields[$k]);
                 }
               }
             }
           }

           return fields;
         }

        /**
         * Retrieves the fields for a list of indices/types.
         */
        function getIndexTypeFields(index, type)
        {
          if(type == "") {
            var fields = [];

            var types = _.keys(model[index].mappings);
            for (var $i = 0; $i < types.length; $i++) {
              var typeFields = _.keys(model[index].mappings[types[$i]].properties);
              for (var $j = 0; $j < typeFields.length; $j++) {
                if (!_.contains(fields, typeFields[$j])) {
                  fields.push(typeFields[$j]);
                }
              }
            }

            return fields;
          } else {
            if(_.contains(_.keys(model[index].mappings), type)) {
              return _.keys(model[index].mappings[type].properties);
            } else {
              return [];
            }
          }
        }

        /**
         * Refreshes the list of displayed fields
         */
        function refreshTypes()
        {
          //cleanup
          $("#typelist").empty();
          $("#fields").empty();

          var indices = $("#indices").val();
          var types = getIndexTypes(indices);
          _.each(types, function (type) {
            $("#typelist").append(
              '<li>' +
                '<label>' +
                  '<input type="checkbox" class="type" name="type[]" value="' + type + '" style="margin: 0px;" checked> ' +
                    '<span>' + type + '</span>' +
                '</label>' +
              '</li>'
            );
          });
        }

        /**
         * Refreshes the list of displayed fields
         */
        function refreshFields()
        {
          //cleanup
          $("#fields").empty();
          $("#sortBy").empty();

          var indices = $("#indices").val();
          var types = [];
          $('#typelist input:checked').each(function() {
              types.push($(this).val());
          });

          var fields = getFields(indices, types);

          //field list
          _.each(fields, function (field) {
            $("#fields").append(
              '<li>' +
                '<label>' +
                  '<input type="checkbox" class="field" name="fields[]" value="' + field + '" style="margin: 0px;" checked="true"> ' +
                    '<span>' + field + '</span>' +
                '</label>' +
              '</li>'
            );
          });

          //sortby list
          refreshSortBy();
        }

        function refreshSortBy()
        {
          $("#sortBy").empty();

          var fields = [];
          $('#fields input:checked').each(function () {
              fields.push($(this).val());
          });

          _.each(extraSortFields, function (field) {
            $("#sortBy").append("<option value='" + field + "'>" + field + "</option>");
          });
          _.each(fields, function (field) {
            $("#sortBy").append("<option value='" + field + "'>" + field + "</option>");
          });

          $("#sortBy").selectpicker("refresh");
        }

        $('#workspace').html(tpl({
            indices:indices
        }));

        $('#queryString').bind('focus', doFocus('#queryString', '#querySubmit'), false);
        $("#queryString").focus();

        $("#querySubmit").click(function () {
            queryRoute.doQuery();
        });

        $("[rel=tipRight]").tooltip();
        $('.selectpicker').selectpicker();

        $('#indices').bind('change', function(e) {
          // populate types
          refreshTypes();

          // populate fields
          refreshFields();
        });

        $('#typelist').on("change", ".type", function() {
          // populate fields
          refreshFields();
        });

        $('#toggleTypes').bind('click', function(e) {
            e.preventDefault();
            var isChecked = $(this).hasClass('checked');

            if(isChecked){
                $(this).removeClass('checked');
                $(this).find('i').removeClass('icon-check').addClass('icon-check-empty');
            }else{
                $(this).addClass('checked');
                $(this).find('i').removeClass('icon-check-empty').addClass('icon-check');
            }

            $('#typelist li label input[type="checkbox"]').prop('checked', !isChecked);

            refreshFields();
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

            $('#fields li label input[type="checkbox"]').prop('checked', !isChecked);

            //refresh sort
            refreshSortBy();
        });

        $('#fields').on("change", ".field", function(e) {
          refreshSortBy();
        });

        return this;
    }
});
