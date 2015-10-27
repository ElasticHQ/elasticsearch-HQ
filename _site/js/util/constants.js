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

var HQVERSION = '1.0.0';

var REMOTE_API_PATH = 'http://www.elastichq.org/api';
//var REMOTE_API_PATH = 'http://local.dev/elastichqorg/api';

/**** GLOBALS ****/
// log =1, no-log =0.
var debugMode = 0;

// globally available cluster object maintains state of models and connection url.
var cluster;

// personalization
var settingsModel;

var POLLER_MIN_FREQUENCY = 5000;
var POLLER_MAX_FREQUENCY = 3600000;

var showedVersionCheckMessage = false;

var postedStatsData = false;
