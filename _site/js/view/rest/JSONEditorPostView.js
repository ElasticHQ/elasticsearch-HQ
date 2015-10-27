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

var JSONEditorPostView = Backbone.View.extend(
    {
        requestBody:undefined,
        resultBody:undefined,
        initialize:function (args) {
        },
        render:function () {
            var _this = this;

            ace.require("ace/ext/language_tools");
            var editor = ace.edit("jsoneditor");
            var requestBodyObject = editor.getSession().getValue();

            var request = $.ajax({
                url:cluster.get("connectionRootURL") + this.model.endpoint,
                type:this.model.action,
                data:requestBodyObject
            });

            request.success(function (data, textStatus, jqXHR) {

                _this.resultBody = JSON.stringify(data, undefined, 2);

                var output = ace.edit("jsonoutput");
                output.getSession().setMode("ace/mode/json");
                output.setTheme("ace/theme/monokai");
                output.setShowPrintMargin(false);
                output.setFontSize(13);
                output.getSession().setUseSoftTabs(true);
                output.getSession().setUseWrapMode(true);
                output.setValue(_this.resultBody);
                output.getSession().selection.clearSelection();
                output.setOptions({
                    readOnly:true
                });
                output.moveCursorTo(1, 1);
                output.getSession().foldAll(1, 10000);
            });

            request.error(function (data, textStatus, jqXHR) {

                _this.resultBody = JSON.stringify(data, undefined, 2);

                var output = ace.edit("jsonoutput");
                output.getSession().setMode("ace/mode/json");
                output.setTheme("ace/theme/monokai");
                output.setShowPrintMargin(false);
                output.setFontSize(13);
                output.getSession().setUseSoftTabs(true);
                output.getSession().setUseWrapMode(true);
                output.setValue(_this.resultBody);
                output.getSession().selection.clearSelection();
                output.setOptions({
                    readOnly:true
                });
                output.moveCursorTo(1, 1);
                //output.getSession().foldAll(1, 10000);
            });

            request.complete(function (jqXHR, textStatus) {
// TODO: may be a good place to add help or response information.

            });

            return this;
        }
    });