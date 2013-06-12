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
            label:"Name",
            value:"stats.name"
        },
        {
            label:"IP",
            value:"stats.transport_address"
        },
        {
            label:"ID",
            value:"id"
        },
        {
            label:"ES Uptime",
            value:"stats.jvm.uptime",
            unit:"days"
        },
        {
            label:"CPU",
            value:"info.os.cpu.model"
        },
        {
            label:"Cores",
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
            label:"Store size",
            value:"stats.indices.store.size"
        },
        {
            label:"Docs total",
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
            label:"Merge size",
            value:"stats.indices.merges.total_size"
        },
        {
            label:"Merge time",
            value:"stats.indices.merges.total_time"
        }/*,

         {


         "Store size":{
         "val":"stats.indices.store.size"
         }
         },
         {
         "Docs total":{
         "format":"comma",
         "val":"stats.indices.docs.count"
         }
         },
         {
         "Docs deleted %":{
         "comment":"High values indicate insufficient merging. Slow I/O?",
         "format":"pct",
         "val":"stats.indices.docs.deleted / stats.indices.docs.count",
         "upper_limit":[ "0.1", "0.25" ]
         }
         },
         {
         "Merge size":{
         "val":"stats.indices.merges.total_size"
         }
         },
         {
         "Merge time":{
         "val":"stats.indices.merges.total_time"
         }
         },
         {
         "Merge rate":{
         "unit":"MB/s",
         "comment":"Low rates indicate throttling or slow I/O",
         "format":"float",
         "val":"stats.indices.merges.total_size_in_bytes / stats.indices.merges.total_time_in_millis / 1000"
         }
         },
         {
         "File descriptors":{
         "format":"comma",
         "val":"stats.process.open_file_descriptors"
         }
         }*/
    ];
}

function action_rules() {
    return [
        {
            "Indexing - index":{
                "comment":"High values indicate complex documents or slow I/O or CPU.",
                "format":"ms",
                "val":"stats.indices.indexing.index_time_in_millis / stats.indices.indexing.index_total",
                "upper_limit":[ "10", "50" ]
            }
        },
        {
            "Indexing - delete":{
                "comment":"High values indicate slow I/O.",
                "format":"ms",
                "val":"stats.indices.indexing.delete_time_in_millis / stats.indices.indexing.delete_total",
                "upper_limit":[ "5", "10" ]
            }
        },
        {
            "Search - query":{
                "comment":"High values indicate complex or inefficient queries, insufficient use of filters, insufficient RAM for caching, slow I/O or CPU.",
                "format":"ms",
                "val":"stats.indices.search.query_time_in_millis / stats.indices.search.query_total",
                "upper_limit":[ "50", "500" ]
            }
        },
        {
            "Search - fetch":{
                "comment":"High values indicate slow I/O, large docs, or fetching too many docs, eg deep paging.",
                "format":"ms",
                "val":"stats.indices.search.fetch_time_in_millis / stats.indices.search.fetch_total",
                "upper_limit":[ "8", "15" ]
            }
        },
        {
            "Get - total":{
                "comment":"High values indicate slow I/O.",
                "format":"ms",
                "val":"stats.indices.get.time_in_millis / stats.indices.get.total",
                "upper_limit":[ "5", "10" ]
            }
        },
        {
            "Get - exists":{
                "comment":"???",
                "format":"ms",
                "val":"stats.indices.get.exists_time_in_millis / stats.indices.get.exists_total",
                "upper_limit":[ "5", "10" ]
            }
        },
        {
            "Get - missing":{
                "comment":"???",
                "format":"ms",
                "val":"stats.indices.get.missing_time_in_millis / stats.indices.get.missing_total",
                "upper_limit":[ "2", "5" ]
            }
        },
        {
            "Refresh":{
                "comment":"High values indicate slow I/O.",
                "format":"ms",
                "val":"stats.indices.refresh.total_time_in_millis / stats.indices.refresh.total",
                "upper_limit":[ "10", "20" ]
            }
        },
        {
            "Flush":{
                "comment":"High values indicate slow I/O.",
                "format":"ms",
                "val":"stats.indices.flush.total_time_in_millis / stats.indices.flush.total",
                "upper_limit":[ "750", "1500" ]
            }
        }
    ];
}

function cache_rules() {
    return [
        {
            "Field size":{
                "val":"stats.indices.fielddata.memory_size"
            }
        },
        {
            "Field evictions":{
                "comment":"Field values should not be evicted - insufficient RAM for current queries.",
                "format":"comma",
                "val":"stats.indices.fielddata.evictions",
                "upper_limit":[ "0", "0" ]
            }
        },
        {
            "Filter size":{
                "val":"stats.indices.cache.filter_size"
            }
        },
        {
            "Filter evictions":{
                "unit":"per query",
                "comment":"High values indicate insufficient RAM for current queries, or frequent use of one-off values in filters.",
                "format":"float",
                "val":"stats.indices.cache.filter_evictions / stats.indices.search.query_total",
                "upper_limit":[ "0.1", "0.2" ]
            }
        },
        {
            "ID size":{
                "val":"stats.indices.cache.id_cache_size"
            }
        },
        {
            "ID %":{
                "val":"stats.indices.cache.id_cache_size_in_bytes / stats.jvm.mem.heap_committed_in_bytes",
                "format":"pct",
                "upper_limit":["0.2", "0.4"],
                "comment":"Large parent/child ID caches reduce the amount of memory available on the heap."
            }
        }
    ];
}

function memory_rules() {
    return [
        {
            "Total mem":{
                "unit":"gb",
                "format":"comma",
                "val":"( stats.os.mem.actual_used_in_bytes + stats.os.mem.actual_free_in_bytes ) / 1024 / 1024 / 1024"
            }
        },
        {
            "Heap size":{
                "unit":"gb",
                "comment":"A heap size over 32GB causes the JVM to use uncompressed pointers and can slow GC.",
                "format":"float",
                "val":"stats.jvm.mem.heap_committed_in_bytes / 1024 / 1024 / 1024",
                "upper_limit":[ "30", "32" ]
            }
        },
        {
            "Heap % of RAM":{
                "comment":"Approx 40-50% of RAM should be available to the kernel for file caching.",
                "format":"pct",
                "val":"stats.jvm.mem.heap_committed_in_bytes / (stats.os.mem.actual_used_in_bytes + stats.os.mem.actual_free_in_bytes)",
                "upper_limit":[ "0.6", "0.75" ]
            }
        },
        {
            "Heap used %":{
                "format":"pct",
                "val":"stats.jvm.mem.heap_used_in_bytes / stats.jvm.mem.heap_committed_in_bytes"
            }
        },
        {
            "GC MarkSweep frequency":{
                "unit":"s",
                "comment":"Too frequent GC indicates memory pressure and need for more heap space.",
                "format":"comma",
                "val":"stats.jvm.uptime_in_millis /  stats.jvm.gc.collectors.ConcurrentMarkSweep.collection_count / 1000",
                "lower_limit":[ "30", "15", "0" ]
            }
        },
        {
            "GC MarkSweep duration":{
                "comment":"Long durations may indicate that swapping is slowing down GC, or need for more heap space.",
                "format":"ms",
                "val":"stats.jvm.gc.collectors.ConcurrentMarkSweep.collection_time_in_millis / stats.jvm.gc.collectors.ConcurrentMarkSweep.collection_count",
                "upper_limit":[ "150", "400" ]
            }
        },
        {
            "GC ParNew frequency":{
                "unit":"s",
                "format":"comma",
                "val":"stats.jvm.uptime_in_millis / stats.jvm.gc.collectors.ParNew.collection_count / 1000"
            }
        },
        {
            "GC ParNew duration":{
                "format":"ms",
                "val":"stats.jvm.gc.collectors.ParNew.collection_time_in_millis / stats.jvm.gc.collectors.ParNew.collection_count",
                "upper_limit":[ "100", "200" ]
            }
        },
        {
            "Swap":{
                "val":"stats.os.swap.used_in_bytes / 1024 / 1024",
                "unit":"mb",
                "upper_limit":["1", "1"],
                "comment":"Any use of swap by the JVM, no matter how small, can greatly impact the speed of the garbage collector."
            }
        }
    ];
}

function network_rules() {
    return [
        {
            "HTTP connection rate":{
                "unit":"per sec",
                "comment":"Too many HTTP connection per second may exhaust the number of sockets available in the kernel, and cause a service outage.",
                "format":"comma",
                "val":"stats.http.total_opened / stats.jvm.uptime_in_millis * 1000",
                "upper_limit":[ "5", "30" ]
            }
        }
    ];
}