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
 * This class taken from https://gist.github.com/clintongormley/5394980
 */


/**
 *
 * @param node
 * @param ruleKey
 * @param ruleUnits
 * @param ruleFormat
 * @return {String}
 */
function calculateRuleValue(node, ruleKey, ruleUnits, ruleFormat) {
    var theValue = "N/A";
    if (node != undefined && ruleKey != undefined) {
        theValue = lookupValue(node, ruleKey);
        if (ruleFormat != undefined) {
            if (theValue != undefined) {
                theValue = Formats[ruleFormat](theValue);
            }
            else {
                theValue = Formats[ruleFormat](0);
            }
        }
        if (ruleUnits != undefined) {
            theValue = theValue + ' ' + ruleUnits;
        }
    }
    return theValue;
}

/**
 * Cell color for a given value according to the threshhold values in the rule.
 * @return {String}
 */
function calculateCellClass(node, rule) {

    var val = lookupValue(node, rule.value);
    if (val == undefined)
        val = 0;


    if (rule.upper_limit) {
        if (val <= rule.upper_limit[0]) {
            return 'success';
        } else {
            if (val <= rule.upper_limit[1]) {
                return 'warning';
            } else {
                return 'error';
            }
        }
    }
    if (rule.lower_limit) {
        if (rule.lower_limit.length === 3 && val === 0) {
            return 'success';
        }
        return val >= rule.lower_limit[0] ? 'success'
            : val >= rule.lower_limit[1] ? 'warning' : 'error';
    }
    return ''
}

/**
 * Formats numbers according to their rule settings
 * @type {Object}
 */
var Formats = {
    comma:function (n) {
        n = Math.round(n) + '';
        var re = /^([-+]?\d+)(\d{3})/;
        while (1) {
            var new_n = n.replace(re, '$1,$2');
            if (new_n === n) {
                break;
            }
            n = new_n
        }
        return n;
    },
    pct:function (n) {
        n = Math.round(n * 1000) / 10;
        return n + '%';
    },
    ms:function (n) {
        n = Math.round(n * 100) / 100;
        return n + 'ms';
    },
    float:function (n) {
        return Math.round(n * 10) / 10;
    }
};

function general_rules() {
    return [
        {
            label:"Node Name:",
            value:"stats.name"
        },
        {
            label:"IP Address:",
            value:"stats.transport_address"
        },
        {
            label:"Node ID:",
            value:"id"
        },
        {
            label:"ES Uptime:",
            value:"stats.jvm.uptime",
            unit:"days"
        },
        {
            label:"CPU:",
            value:"info.os.cpu.model"
        },
        {
            label:"# Cores:",
            value:"info.os.cpu.total_cores"
        }/*,
         {
         label:"",
         value:""
         }*/
    ];
}

function fs_rules() {
    return [
        {
            label:"Store Size:",
            value:"stats.indices.store.size"
        },
        {
            label:"# Documents:",
            value:"stats.indices.docs.count"
        },
        {
            label:"Documents Deleted:",
            value:"stats.docsdeletedperc",
            comment:"High values indicate insufficient merging.<br/>Slow I/O?",
            format:"pct",
            upper_limit:[ "0.1", "0.25" ]
        },
        {
            label:"Merge Size:",
            value:"stats.indices.merges.total_size"
        },
        {
            label:"Merge Time:",
            value:"stats.indices.merges.total_time"
        },
        {
            label:"Merge Rate:",
            unit:"MB/s",
            comment:"Low rates indicate throttling or slow I/O",
            format:"float",
            value:"node.stats.mergerate"
        },
        {
            label:"File Descriptors:",
            format:"comma",
            value:"stats.process.open_file_descriptors"
        }
    ];
}

function action_rules() {
    return [
        {
            label:"Indexing - Index:",
            comment:"High values indicate complex documents or slow I/O or CPU.",
            format:"ms",
            value:"",
            upper_limit:[ "10", "50" ]

        },
        {
            label:"Indexing - Delete:",
            comment:"High values indicate slow I/O.",
            format:"ms",
            value:"stats.indexdelete",
            upper_limit:[ "5", "10" ]

        },
        {
            label:"Search - Query:",
            comment:"High values indicate complex or inefficient queries, insufficient use of filters, insufficient RAM for caching, slow I/O or CPU.",
            format:"ms",
            value:"stats.searchquery",
            upper_limit:[ "50", "500" ]

        },
        {
            label:"Search - Fetch:",
            comment:"High values indicate slow I/O, large docs, or fetching too many docs, eg deep paging.",
            format:"ms",
            value:"stats.searchfetch",
            upper_limit:[ "8", "15" ]

        },
        {
            label:"Get - Total:",
            comment:"High values indicate slow I/O.",
            format:"ms",
            value:"stats.gettotal",
            upper_limit:[ "5", "10" ]

        },
        {
            label:"Get - Exists:",
            //comment:"???",
            format:"ms",
            value:"stats.getexists",
            upper_limit:[ "5", "10" ]

        },
        {
            label:"Get - Missing:",
            //comment:"???",
            format:"ms",
            value:"stats.getmissing",
            upper_limit:[ "2", "5" ]

        },
        {
            label:"Refresh:",
            comment:"High values indicate slow I/O.",
            format:"ms",
            value:"stats.refresh",
            upper_limit:[ "10", "20" ]

        },
        {
            label:"Flush:",
            comment:"High values indicate slow I/O.",
            format:"ms",
            value:"stats.flush",
            upper_limit:[ "750", "1500" ]

        }
    ];
}

function cache_rules() {
    return [
        {
            label:"Field Size:",
            value:"stats.indices.fielddata.memory_size"

        },
        {
            label:"Field Evictions:",
            comment:"Field values should not be evicted - insufficient RAM for current queries.",
            format:"comma",
            value:"stats.indices.fielddata.evictions",
            upper_limit:[ "0", "0" ]

        },
        {
            label:"Filter Cache Size:",
            value:"stats.indices.filter_cache.memory_size"
        },
        {
            label:"Filter Evictions:",
            unit:"per query",
            comment:"High values indicate insufficient RAM for current queries, or frequent use of one-off values in filters.",
            format:"float",
            value:"stats.filterevictions",
            upper_limit:[ "0.1", "0.2" ]

        },
        {
            label:"ID Cache Size:",
            value:"stats.indices.id_cache.memory_size"

        },
        {
            label:"% ID Cache:",
            value:"stats.idpercentage",
            format:"pct",
            upper_limit:["0.2", "0.4"],
            comment:"Large parent/child ID caches reduce the amount of memory available on the heap."

        }
    ];
}

function memory_rules() {
    return [
        {
            label:"Total Memory:",
            unit:"gb",
            format:"comma",
            value:"stats.totalmem"

        },
        {
            label:"Heap Size:",
            unit:"gb",
            comment:"A heap size over 32GB causes the JVM to use uncompressed pointers and can slow GC.",
            format:"float",
            value:"stats.heapsize",
            upper_limit:[ "30", "32" ]

        },
        {
            label:"Heap % of RAM:",
            comment:"Approx 40-50% of RAM should be available to the kernel for file caching.",
            format:"pct",
            value:"stats.heappercram",
            upper_limit:[ "0.6", "0.75" ]

        },
        {
            label:"% Heap Used:",
            format:"pct",
            value:"stats.heapused"

        },
        {
            label:"GC MarkSweep Frequency:",
            unit:"s",
            comment:"Too frequent GC indicates memory pressure and need for more heap space.",
            format:"comma",
            value:"stats.gcfreq",
            lower_limit:[ "30", "15", "0" ]

        },
        {
            label:"GC MarkSweep Duration:",
            comment:"Long durations may indicate that swapping is slowing down GC, or need for more heap space.",
            format:"ms",
            value:"stats.gcduration",
            upper_limit:[ "150", "400" ]

        },
        {
            label:"GC ParNew Frequency:",
            unit:"s",
            format:"comma",
            value:"stats.gcparnew"

        },
        {
            label:"GC ParNew Duration:",
            format:"ms",
            value:"stats.gcparnewduration",
            upper_limit:[ "100", "200" ]

        },
        {
            label:"Swap Space:",
            value:"stats.swap",
            unit:"mb",
            upper_limit:["1", "1"],
            comment:"Any use of swap by the JVM, no matter how small, can greatly impact the speed of the garbage collector."

        }
    ];
}

function network_rules() {
    return [
        {
            label:"HTTP Connection Rate:",
            unit:"per sec",
            comment:"Too many HTTP connections per second may exhaust the number of sockets available in the kernel, and cause a service outage.",
            format:"comma",
            value:"stats.httpconnectrate",
            upper_limit:[ "5", "30" ]

        }
    ];
}