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

var JSONEditorView = Backbone.View.extend(
    {
        initialize:function (args) {
        },
        render:function () {
            var _this = this;
            var template = _.template(restTemplate.jsonEditorView);
            $('#workspace').html(template(
                {
                })
            );
            _this.redrawEndPointSelect();

            ace.require("ace/ext/language_tools");
            var editor = ace.edit("jsoneditor");
            editor.getSession().setMode("ace/mode/json");
            editor.setTheme("ace/theme/monokai");
            editor.setShowPrintMargin(false);
            editor.setFontSize(13);
            editor.getSession().setUseSoftTabs(true);
            editor.getSession().setUseWrapMode(true);
            editor.setOptions({
                enableBasicAutocompletion:true
            });

            editor.setValue("{\n\n}");
            var code = editor.getSession().getValue();

            editor.getSession().setValue(code); // prettify
            editor.focus();
            editor.getSession().getSelection().selectionLead.setPosition(1, 1);

            var output = ace.edit("jsonoutput");
            output.getSession().setMode("ace/mode/json");
            output.setTheme("ace/theme/monokai");
            output.setShowPrintMargin(false);
            output.setFontSize(13);
            output.getSession().setUseSoftTabs(true);
            output.getSession().setUseWrapMode(true);

            $("#jsonformsubmit").click(function () {
                restRoute.doEditorQuery();
            });

            $("#jsonformaction").change(function () {
                _this.redrawEndPointSelect();
                $('.selectpicker').selectpicker();
            });

            $("[rel=tipRight]").tooltip();
            $("[rel=popRight]").popover();
            $('.selectpicker').selectpicker();

            return this;
        },
        getEndPoints:function () {
            var action = $('#jsonformaction option:selected').val();
            if (action === undefined) {
                action = "GET";
            }
            var endpoints = endPointMap.getEndPointStruct(action);

            return endpoints;
        },
        redrawEndPointSelect:function () {
            var template = _.template(restTemplate.jsonapiendpoints);
            $('#endpointSelect').html(template(
                {
                    endpoints:this.getEndPoints()
                })
            );

        }
    });