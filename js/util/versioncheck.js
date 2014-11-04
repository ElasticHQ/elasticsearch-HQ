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
 * Performs CORS version check
 */
var checkVersion = function () {

    try {
        if (!showedVersionCheckMessage) {

            var uuid = settingsModel.get('settings').uuid;

            $.ajax({
                type:'GET',
                url:REMOTE_API_PATH + '/hq_settings.php',
                processData:false,
                cache:false,
                crossDomain:true,
                dataType:'json',
                data:"uuid=" + uuid,
                success:function (data) {
                    if (data != undefined) {
                        if (data.version != undefined) {
                            if (data.version !== HQVERSION) {
                                var upgradeText = 'ElasticHQ v' + data.version + ' is available.<br/>You should consider <a href="http://www.elastichq.org/gettingstarted.html" target="_blank">upgrading</a>.'
                                    + '[<a href="https://github.com/royrusso/elasticsearch-HQ/issues?milestone=16&page=1&state=closed" target="_blank">ChangeLog</a>]<br/><small>(You are running version ' + HQVERSION + '.)</small>';
                                show_stack_bottomright({hide:false, type:'error', title:'New Version Available!', text:upgradeText});
                                showedVersionCheckMessage = true;
                            }
                        }
                    }
                },
                error:function (XMLHttpRequest, textStatus, errorThrown) {
                    // die silently
                    console.log('ERROR! ' + XMLHttpRequest.responseText);
                }
            });
        }
    }
    catch (e) {
        console.log('ERROR! ' + e.message);
    }
};