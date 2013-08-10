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

var guid = {};

guid.setGUID = function () {
    var guid = this.getGUID();
    if (guid == undefined) {
        guid = this.generateGUID();
        $.cookie('hquid', guid, { expires:365, path:'/' });
    }
    return guid;
};

guid.getGUID = function () {
    return $.cookie('hquid');
};

guid.generateGUID = function () {
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
};

guid.S4 = function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
};
