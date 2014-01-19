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

var versionUtil = {};

/**
 *
 * @param a base to compare
 * @param b arg to compare
 * @return {Boolean} true if b > a
 */
versionUtil.isNewer = function (a, b) {
    try {
        var partsA = a.split('.');
        var partsB = b.split('.');
        var numParts = partsA.length > partsB.length ? partsA.length : partsB.length;
        var i;

        for (i = 0; i < numParts; i++) {
            if ((parseInt(partsB[i], 10) || 0) !== (parseInt(partsA[i], 10) || 0)) {
                return ((parseInt(partsB[i], 10) || 0) > (parseInt(partsA[i], 10) || 0));
            }
        }
        return false;
    } catch (e) {

    }
    return false;
};