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

var restTemplate = {};

restTemplate.sideNav = [
    '<ul class="nav nav-list well">',
    '<li class="nav-header">Cluster</li>',
    '<li><a href="#">Home</a></li>',
    '<li><a href="#">Library</a></li>',
    '<li><a href="#">Home</a></li>',
    '<li><a href="#">Library</a></li>',
    '<li><a href="#">Home</a></li>',
    '<li><a href="#">Library</a></li>',
    '<li class="nav-header">Nodes</li>',
    '<li><a href="#">Home</a></li>',
    '<li><a href="#">Library</a></li>',
    '<li><a href="#">Home</a></li>',
    '<li><a href="#">Library</a></li>',
    '<li class="nav-header">Indices</li>',
    '<li><a href="#">Home</a></li>',
    '<li><a href="#">Library</a></li>',
    '<li><a href="#">Home</a></li>',
    '<li><a href="#">Library</a></li>',
    '</ul>'
].join('\n');

restTemplate.mainView = [
    '<div class="text-center"><h2>REST API UI</h2></div>',
    '<div class="span2">',
    restTemplate.sideNav,
    '</div>',
    '<div class="span9 center-table" style="min-height: 1024px;">',
    '',
    '</div>'
].join("\n");