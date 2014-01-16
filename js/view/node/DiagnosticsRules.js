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
    if (node !== undefined && ruleKey !== undefined) {
        theValue = lookupValue(node, ruleKey);
        if (ruleFormat !== undefined) {
            if (theValue !== undefined) {
                theValue = Formats[ruleFormat](theValue);
            }
            else {
                theValue = Formats[ruleFormat](0);
            }
        }
        if (ruleUnits !== undefined) {
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
    if (val === undefined) {
        val = 0;
    }

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
        if (val >= rule.lower_limit[0]) {
            return 'success';
        } else {
            if (val >= rule.lower_limit[1]) {
                return 'warning';
            } else {
                return 'error';
            }
        }
    }
    return '';
}

/**
 * Assemble the cell popover for help on the diagnostics screen.
 * @param node
 * @param rule
 */
function makeDiagnosticsPopOver(node, rule) {
    var tpl = '';

    tpl = '<ul style="font-size: 13px;">';
    if (rule.comment) {
        tpl = tpl + '<div class="alert alert-info"><i class="icon-info-sign"></i> ' + rule.comment + '</div>';
    }

    if (rule.formula !== undefined) {
        tpl = tpl + '<li><b>Keys: </b> ' + rule.formula + '</li>';
    }
    else {
        tpl = tpl + '<li><b>Keys: </b> ' + rule.value + '</li>';
        rule.formula = rule.value;
        rule.formulaKeys = rule.value;
    }

    // replace formula values with real numbers from node.
    tpl = tpl + '<li><b>Value: </b> ';
    var mathInt = 0;
    var keyString = rule.formula;
    if (rule.formulaKeys !== undefined) {
        keyString = rule.formula;
        var keys = rule.formulaKeys.split(/@@/);
        for (i = 0; i < keys.length; i++) {
            var part = keys[i]; // stats.foo.bar.size
            var partValue = lookupValue(node, part);
            if (partValue === undefined) {
                partValue = 0;
            }
            keyString = keyString.replace(part, partValue);
        }
    }

    try {
        //mathInt = parseInt(keyString);
        mathInt = Parser.evaluate(keyString);
    } catch (e) {
    }

    if (isNaN(mathInt) || !isFinite(mathInt)) {
        mathInt = 0;
    }

    if (rule.calc !== false) {
        tpl = tpl + keyString + ' = ' + mathInt + '</li>';
    }
    else {
        tpl = tpl + keyString + '</li>';
    }

    if (rule.upper_limit) {
        tpl = tpl + '<li><b>Thresholds:</b> ';
        tpl = tpl + '<ul><li>' + mathInt + ' <= ' + rule.upper_limit[0] + ' = Pass!</li>';
        tpl = tpl + '<li>' + mathInt + ' <= ' + rule.upper_limit[1] + ' = Warning!</li></ul>';
        tpl = tpl + '</li>';
    }
    if (rule.lower_limit) {
        tpl = tpl + '<li><b>Thresholds:</b> ';
        tpl = tpl + '<ul><li>' + mathInt + ' >= ' + rule.lower_limit[0] + ' = Pass!</li>';
        tpl = tpl + '<li>' + mathInt + ' >= ' + rule.lower_limit[1] + ' = Warning!</li></ul>';
        tpl = tpl + '</li>';
    }

    tpl = tpl + '</ul>';

    return tpl;
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
            n = new_n;
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
            value:"stats.name",
            formula:"stats.name",
            formulaKeys:"stats.name",
            calc:false
        },
        {
            label:"IP Address:",
            value:"stats.transport_address",
            formula:"stats.transport_address",
            formulaKeys:"stats.transport_address",
            calc:false
        },
        {
            label:"Node ID:",
            value:"id",
            formula:"id",
            formulaKeys:"id",
            calc:false
        },
        {
            label:"ES Uptime:",
            value:"stats.jvm.uptime",
            formula:"stats.jvm.uptime_in_millis/1000/60/60/24",
            formulaKeys:"stats.jvm.uptime_in_millis",
            unit:"days"
        }/*,
         {
         label:"CPU:",
         value:"info.os.cpu.model",
         formula:"info.os.cpu.model",
         formulaKeys:"info.os.cpu.model",
         calc:false
         },
         {
         label:"# Cores:",
         value:"info.os.cpu.total_cores",
         formula:"info.os.cpu.total_cores",
         formulaKeys:"info.os.cpu.total_cores",
         calc:false
         }*//*,
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
            value:"stats.storeSize",
            formula:"stats.indices.store.size_in_bytes",
            formulaKeys:"stats.indices.store.size_in_bytes",
            calc:false
        },
        {
            label:"# Documents:",
            value:"stats.indices.docs.count",
            formula:"stats.indices.docs.count",
            formulaKeys:"stats.indices.docs.count",
            format:"comma",
            calc:false
        },
        {
            label:"Documents Deleted:",
            value:"stats.docsdeletedperc",
            formula:"stats.indices.docs.deleted / stats.indices.docs.count",
            formulaKeys:"stats.indices.docs.deleted@@stats.indices.docs.count",
            comment:"High values indicate insufficient merging.<br/>Slow I/O?",
            format:"pct",
            upper_limit:[ "0.1", "0.25" ]
        },
        {
            label:"Merge Size:",
            value:"stats.mergeSize",
            formula:"stats.indices.merges.total_size_in_bytes",
            formulaKeys:"stats.indices.merges.total_size_in_bytes",
            calc:false
        },
        {
            label:"Merge Time:",
            value:"stats.mergeTime",
            formula:"stats.indices.merges.total_time_in_millis",
            formulaKeys:"stats.indices.merges.total_time_in_millis",
            calc:false
        },
        {
            label:"Merge Rate:",
            unit:"MB/s",
            comment:"Low rates indicate throttling or slow I/O",
            format:"float",
            value:"stats.mergerate",
            formula:"stats.indices.merges.total_size_in_bytes / stats.indices.merges.total_time_in_millis / 1000",
            formulaKeys:"stats.indices.merges.total_size_in_bytes@@stats.indices.merges.total_time_in_millis"
        },
        {
            label:"File Descriptors:",
            format:"comma",
            value:"stats.process.open_file_descriptors",
            formula:"stats.process.open_file_descriptors",
            formulaKeys:"stats.process.open_file_descriptors",
            calc:false
        }
    ];
}

function action_rules() {
    return [
        {
            label:"Indexing - Index:",
            comment:"High values indicate complex documents or slow I/O or CPU.",
            format:"ms",
            value:"stats.indexindexing",
            formula:"stats.indices.indexing.index_time_in_millis / stats.indices.indexing.index_total",
            formulaKeys:"stats.indices.indexing.index_time_in_millis@@stats.indices.indexing.index_total",
            upper_limit:[ "10", "50" ]
        },
        {
            label:"Indexing - Delete:",
            comment:"High values indicate slow I/O.",
            format:"ms",
            value:"stats.indexdelete",
            formula:"stats.indices.indexing.delete_time_in_millis / stats.indices.indexing.delete_total",
            formulaKeys:"stats.indices.indexing.delete_time_in_millis@@stats.indices.indexing.delete_total",
            upper_limit:[ "5", "10" ]
        },
        {
            label:"Search - Query:",
            comment:"High values indicate complex or inefficient queries, insufficient use of filters, insufficient RAM for caching, slow I/O or CPU.",
            format:"ms",
            value:"stats.searchquery",
            formula:"stats.indices.search.query_time_in_millis / stats.indices.search.query_total",
            formulaKeys:"stats.indices.search.query_time_in_millis@@stats.indices.search.query_total",
            upper_limit:[ "50", "500" ]
        },
        {
            label:"Search - Fetch:",
            comment:"High values indicate slow I/O, large docs, or fetching too many docs, eg deep paging.",
            format:"ms",
            value:"stats.searchfetch",
            formula:"stats.indices.search.fetch_time_in_millis / stats.indices.search.fetch_total",
            formulaKeys:"stats.indices.search.fetch_time_in_millis@@stats.indices.search.fetch_total",
            upper_limit:[ "8", "15" ]
        },
        {
            label:"Get - Total:",
            comment:"High values indicate slow I/O.",
            format:"ms",
            value:"stats.gettotal",
            formula:"stats.indices.get.time_in_millis / stats.indices.get.total",
            formulaKeys:"stats.indices.get.time_in_millis@@stats.indices.get.total",
            upper_limit:[ "5", "10" ]
        },
        {
            label:"Get - Exists:",
            //comment:"???",
            format:"ms",
            value:"stats.getexists",
            formula:"stats.indices.get.exists_time_in_millis / stats.indices.get.exists_total",
            formulaKeys:"stats.indices.get.exists_time_in_millis@@stats.indices.get.exists_total",
            upper_limit:[ "5", "10" ]
        },
        {
            label:"Get - Missing:",
            //comment:"???",
            format:"ms",
            value:"stats.getmissing",
            formula:"stats.indices.get.missing_time_in_millis / stats.indices.get.missing_total",
            formulaKeys:"stats.indices.get.missing_time_in_millis@@stats.indices.get.missing_total",
            upper_limit:[ "2", "5" ]

        },
        {
            label:"Refresh:",
            comment:"High values indicate slow I/O.",
            format:"ms",
            value:"stats.refresh",
            formula:"stats.indices.refresh.total_time_in_millis / stats.indices.refresh.total",
            formulaKeys:"stats.indices.refresh.total_time_in_millis@@stats.indices.refresh.total",
            upper_limit:[ "10", "20" ]

        },
        {
            label:"Flush:",
            comment:"High values indicate slow I/O.",
            format:"ms",
            value:"stats.flush",
            formula:"stats.indices.flush.total_time_in_millis / stats.indices.flush.total",
            formulaKeys:"stats.indices.flush.total_time_in_millis@@stats.indices.flush.total",
            upper_limit:[ "750", "1500" ]

        }
    ];
}

function cache_rules() {
    return [
        {
            label:"Field Size:",
            value:"stats.fieldsize",
            formula:"stats.indices.fielddata.memory_size_in_bytes",
            formulaKeys:"stats.indices.fielddata.memory_size_in_bytes",
            calc:false

        },
        {
            label:"Field Evictions:",
            comment:"Field values should not be evicted - insufficient RAM for current queries.",
            format:"comma",
            value:"stats.indices.fielddata.evictions",
            upper_limit:[ "0", "0" ],
            calc:false

        },
        {
            label:"Filter Cache Size:",
            value:"stats.filtercache",
            formula:"stats.indices.filter_cache.memory_size_in_bytes",
            formulaKeys:"stats.indices.filter_cache.memory_size_in_bytes",
            calc:false
        },
        {
            label:"Filter Evictions:",
            unit:"per query",
            comment:"High values indicate insufficient RAM for current queries, or frequent use of one-off values in filters.",
            format:"float",
            value:"stats.filterevictions",
            formula:"stats.indices.filter_cache.evictions / stats.indices.search.query_total",
            formulaKeys:"stats.indices.filter_cache.evictions@@stats.indices.search.query_total",
            upper_limit:[ "0.1", "0.2" ]

        },
        {
            label:"ID Cache Size:",
            value:"stats.indices.id_cache.memory_size",
            calc:false

        },
        {
            label:"% ID Cache:",
            value:"stats.idpercentage",
            formula:"stats.indices.id_cache.memory_size_in_bytes / stats.jvm.mem.heap_committed_in_bytes",
            formulaKeys:"stats.indices.id_cache.memory_size_in_bytes@@stats.jvm.mem.heap_committed_in_bytes",
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
            value:"stats.totalmem",
            formula:"( stats.os.mem.actual_used_in_bytes + stats.os.mem.actual_free_in_bytes ) / 1024 / 1024 / 1024",
            formulaKeys:"stats.os.mem.actual_used_in_bytes@@stats.os.mem.actual_free_in_bytes"
        },
        {
            label:"Heap Size:",
            unit:"gb",
            comment:"A heap size over 32GB causes the JVM to use uncompressed pointers and can slow GC.",
            format:"float",
            value:"stats.heapsize",
            formula:"stats.jvm.mem.heap_committed_in_bytes / 1024 / 1024 / 1024",
            formulaKeys:"stats.jvm.mem.heap_committed_in_bytes",
            upper_limit:[ "30", "32" ]
        },
        {
            label:"Heap % of RAM:",
            comment:"Approx 40-50% of RAM should be available to the kernel for file caching.",
            format:"pct",
            value:"stats.heappercram",
            formula:"stats.jvm.mem.heap_committed_in_bytes / (stats.os.mem.actual_used_in_bytes + stats.os.mem.actual_free_in_bytes)",
            formulaKeys:"stats.jvm.mem.heap_committed_in_bytes@@stats.os.mem.actual_used_in_bytes@@stats.os.mem.actual_free_in_bytes",
            upper_limit:[ "0.6", "0.75" ]
        },
        {
            label:"% Heap Used:",
            format:"pct",
            value:"stats.heapused",
            formula:"stats.jvm.mem.heap_used_in_bytes / stats.jvm.mem.heap_committed_in_bytes",
            formulaKeys:"stats.jvm.mem.heap_used_in_bytes@@stats.jvm.mem.heap_committed_in_bytes"
        },
        {
            label:"GC MarkSweep Frequency:",
            unit:"s",
            comment:"Too frequent GC indicates memory pressure and need for more heap space.",
            format:"comma",
            value:"stats.gcfreq",
            formula:"stats.jvm.uptime_in_millis / stats.jvm.gc.collectors.ConcurrentMarkSweep.collection_count / 1000",
            formulaKeys:"stats.jvm.uptime_in_millis@@stats.jvm.gc.collectors.ConcurrentMarkSweep.collection_count",
            lower_limit:[ "30", "15", "0" ]
        },
        {
            label:"GC MarkSweep Duration:",
            comment:"Long durations may indicate that swapping is slowing down GC, or need for more heap space.",
            format:"ms",
            value:"stats.gcduration",
            formula:"stats.jvm.gc.collectors.ConcurrentMarkSweep.collection_time_in_millis / stats.jvm.gc.collectors.ConcurrentMarkSweep.collection_count",
            formulaKeys:"stats.jvm.gc.collectors.ConcurrentMarkSweep.collection_time_in_millis@@stats.jvm.gc.collectors.ConcurrentMarkSweep.collection_count",
            upper_limit:[ "150", "400" ]
        },
        {
            label:"GC ParNew Frequency:",
            unit:"s",
            format:"comma",
            value:"stats.gcparnew",
            formula:"stats.jvm.uptime_in_millis / stats.jvm.gc.collectors.ParNew.collection_count / 1000",
            formulaKeys:"stats.jvm.uptime_in_millis@@stats.jvm.gc.collectors.ParNew.collection_count"
        },
        {
            label:"GC ParNew Duration:",
            format:"ms",
            value:"stats.gcparnewduration",
            formula:"stats.jvm.gc.collectors.ParNew.collection_time_in_millis / stats.jvm.gc.collectors.ParNew.collection_count",
            formulaKeys:"stats.jvm.gc.collectors.ParNew.collection_time_in_millis@@stats.jvm.gc.collectors.ParNew.collection_count",
            upper_limit:[ "100", "200" ]
        },
        {
            label:"G1 GC Young Generation Freq:",
            unit:"s",
            comment:"Too frequent GC indicates memory pressure and need for more heap space.",
            format:"comma",
            value:"stats.g1gcfreq",
            formula:"stats.jvm.uptime_in_millis / stats.jvm.gc.collectors['G1 Young Generation'].collection_count / 1000",
            formulaKeys:"stats.jvm.uptime_in_millis@@stats.jvm.gc.collectors['G1 Young Generation'].collection_count",
            lower_limit:[ "30", "15", "0" ]
        },
        {
            label:"G1 GC Young Generation Duration:",
            comment:"Long durations may indicate that swapping is slowing down GC, or need for more heap space.",
            format:"ms",
            value:"stats.g1gcduration",
            formula:"stats.jvm.gc.collectors['G1 Young Generation'].collection_time_in_millis / stats.jvm.gc.collectors['G1 Young Generation'].collection_count",
            formulaKeys:"stats.jvm.gc.collectors['G1 Young Generation'].collection_time_in_millis@@stats.jvm.gc.collectors['G1 Young Generation'].collection_count",
            upper_limit:[ "150", "400" ]
        },
        {
            label:"G1 GC Old Generation Freq:",
            unit:"s",
            comment:"Too frequent GC indicates memory pressure and need for more heap space.",
            format:"comma",
            value:"stats.g1gcold",
            formula:"stats.jvm.uptime_in_millis / stats.jvm.gc.collectors['G1 Old Generation'].collection_count / 1000",
            formulaKeys:"stats.jvm.uptime_in_millis@@stats.jvm.gc.collectors['G1 Old Generation'].collection_count",
            lower_limit:[ "30", "15", "0" ]
        },
        {
            label:"G1 GC Old Generation Duration:",
            comment:"Long durations may indicate that swapping is slowing down GC, or need for more heap space.",
            format:"ms",
            value:"stats.g1gcoldduration",
            formula:"stats.jvm.gc.collectors['G1 Old Generation'].collection_time_in_millis / stats.jvm.gc.collectors['G1 Old Generation'].collection_count",
            formulaKeys:"stats.jvm.gc.collectors['G1 Old Generation'].collection_time_in_millis@@stats.jvm.gc.collectors['G1 Old Generation'].collection_count",
            upper_limit:[ "150", "400" ]
        },
        {
            label:"Swap Space:",
            value:"stats.swap",
            formula:"stats.os.swap.used_in_bytes / 1024 / 1024",
            formulaKeys:"stats.os.swap.used_in_bytes",
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
            unit:"/second",
            comment:"Too many HTTP connections per second may exhaust the number of sockets available in the kernel, and cause a service outage.",
            format:"comma",
            value:"stats.httpconnectrate",
            upper_limit:[ "5", "30" ],
            formula:"stats.http.total_opened / stats.jvm.uptime_in_millis * 1000",
            formulaKeys:"stats.http.total_opened@@stats.jvm.uptime_in_millis"
        }
    ];
}