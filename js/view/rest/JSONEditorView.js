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
            var template = _.template(restTemplate.jsonEditorView, {});
            $('#workspace').html(template);
            $("[rel=popRight]").popover();

            ace.require("ace/ext/language_tools");
            var editor = ace.edit("jsoneditor");
            editor.getSession().setMode("ace/mode/json");
            editor.setTheme("ace/theme/monokai");
            editor.setOptions({
                enableBasicAutocompletion: true
            });
            //editor.setTheme("ace/theme/crimson_editor");

            editor.setValue("{\n\n}");
            var code = editor.getSession().getValue();

            editor.getSession().setValue(code); // prettify
            editor.focus();
            editor.getSession().getSelection().selectionLead.setPosition(1,1);

            return this;
        }
    });