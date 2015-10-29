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
 * Monitor one node
 */
var nodePoller;

var nodeDiagnosticsPoller;

var indicesPoller;

var indexPoller;

/**
 * Monitor many nodes side-by-side
 */
//var compareNodesPoller;

/**
 * Main button indicating cluster health. Also refreshes the nodelist.
 */
var mainMenuPoller;

/**
 * Cluster Overview screen poller.
 */
var clusterOverviewPoller;


/**
 * Individual node poller
 */
var stopNodePoller = function () {
    if (nodePoller !== undefined) {
        nodePoller.stop();
    }
};

var stopClusterOverviewPoller = function () {
    if (clusterOverviewPoller !== undefined) {
        clusterOverviewPoller.stop();
    }
};

var stopNodeDiagnosticsPoller = function () {
    if (nodeDiagnosticsPoller !== undefined) {
        nodeDiagnosticsPoller.stop();
    }
};

var stopIndicesPoller = function () {
    if (indicesPoller !== undefined) {
        indicesPoller.stop();
    }
};

var stopIndexPoller = function () {
    if (indexPoller !== undefined) {
        indexPoller.stop();
    }
};

/**
 * Not very well named - stops all pollers, except for the main menu poller.
 */
var stopAllNodePollers = function () {
    stopNodePoller();
    stopClusterOverviewPoller();
    stopNodeDiagnosticsPoller();

    //
    stopIndicesPoller();
    stopIndexPoller();
};

var stopAllPollers = function () {

    stopAllNodePollers();

    if (mainMenuPoller !== undefined) {
        mainMenuPoller.stop();
    }
};