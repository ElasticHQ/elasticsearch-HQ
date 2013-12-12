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

var endPointMap = {};

endPointMap.getEndPointStruct = function (action) {
    var endpoints = [];
    endpoints.push({key:'Cluster', value:endPointMap.CLUSTER(action)});
    endpoints.push({key:'Indices', value:endPointMap.INDICES(action)});
    return endpoints;
};

endPointMap.INDICES = function (action) {
    var ep = [];
    ep.POST = [
        "/_refresh"
    ];
    ep.GET = [
        "/_stats",
        "/_segments"
    ];
    ep.PUT = [];

    return ep[action];
};

endPointMap.CLUSTER = function (action) {
    var ep = [];
    ep.POST = [];
    ep.GET = [
        "/",
        "/_cluster/health",
        "/_cluster/state",
        "/_cluster/pending_tasks"
    ];
    ep.PUT = [
        "_cluster/settings"
    ];

    return ep[action];
};