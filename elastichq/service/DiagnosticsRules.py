def cache_rules():
    return [
        {
            "label": "Field Evictions",
            "comment": "Field values should not be evicted - insufficient RAM for current queries.",
            "format": "0,0.0",
            "formula_keys": "indices.fielddata.evictions",
            "upper_limit": [0, 0]
        },
        {
            "label": "Query Cache Evictions",
            "unit": "per query",
            "format": "0,0.0",
            "formula": "indices.query_cache.evictions / indices.search.query_total",
            "formula_keys": "indices.query_cache.evictions@@indices.search.query_total",
            "upper_limit": [0.1, 0.2]
        }
    ]


def fs_rules():
    return [
        {
            "label": "Documents Deleted",
            "value": "docsdeletedperc",
            "formula": "indices.docs.deleted / indices.docs.count",
            "formula_keys": "indices.docs.deleted@@indices.docs.count",
            "comment": "High values indicate insufficient merging.<br/>Slow I/O?",
            "format": "0.000%",
            "upper_limit": [0.1, 0.25]
        },
        {
            "label": "Merge Rate",
            "unit": "MB/s",
            "comment": "Low rates indicate throttling or slow I/O",
            "format": "0,0.0",
            "formula": "indices.merges.total_size_in_bytes / indices.merges.total_time_in_millis / 1000",
            "formula_keys": "indices.merges.total_size_in_bytes@@indices.merges.total_time_in_millis"
        },
        {
            "label": "Disk space used",
            "formula": "(fs.total.total_in_bytes - fs.total.free_in_bytes) / fs.total.total_in_bytes",
            "formula_keys": "fs.total.free_in_bytes@@fs.total.total_in_bytes@@fs.total.total_in_bytes",
            "format": "0.000%",
            "upper_limit": [0.8, 0.95]
        }
    ]


def action_rules():
    return [
        {
            "label": "Indexing - Index",
            "comment": "High values indicate complex documents or slow I/O or CPU.",
            "unit": "ms",
            "format": "0,0.00",
            "formula": "indices.indexing.index_time_in_millis / indices.indexing.index_total",
            "formula_keys": "indices.indexing.index_time_in_millis@@indices.indexing.index_total",
            "upper_limit": [10, 50]
        },
        {
            "label": "Indexing - Delete",
            "comment": "High values indicate slow I/O.",
            "unit": "ms",
            "format": "0,0.00",
            "formula": "indices.indexing.delete_time_in_millis / indices.indexing.delete_total",
            "formula_keys": "indices.indexing.delete_time_in_millis@@indices.indexing.delete_total",
            "upper_limit": [5, 10]
        },
        {
            "label": "Search - Query",
            "comment": "High values indicate complex or inefficient queries, insufficient use of filters, insufficient RAM for caching, slow I/O or CPU.",
            "unit": "ms",
            "format": "0,0.00",
            "formula": "indices.search.query_time_in_millis / indices.search.query_total",
            "formula_keys": "indices.search.query_time_in_millis@@indices.search.query_total",
            "upper_limit": [50, 500]
        },
        {
            "label": "Search - Fetch",
            "comment": "High values indicate slow I/O, large docs, or fetching too many docs, eg deep paging.",
            "unit": "ms",
            "format": "0,0.00",
            "formula": "indices.search.fetch_time_in_millis / indices.search.fetch_total",
            "formula_keys": "indices.search.fetch_time_in_millis@@indices.search.fetch_total",
            "upper_limit": [8, 15]
        },
        {
            "label": "Get - Total",
            "comment": "High values indicate slow I/O.",
            "unit": "ms",
            "format": "0,0.00",
            "formula": "indices.get.time_in_millis / indices.get.total",
            "formula_keys": "indices.get.time_in_millis@@indices.get.total",
            "upper_limit": [5, 10]
        },
        {
            "label": "Get - Exists",
            "comment": "???",
            "unit": "ms",
            "format": "0,0.00",
            "formula": "indices.get.exists_time_in_millis / indices.get.exists_total",
            "formula_keys": "indices.get.exists_time_in_millis@@indices.get.exists_total",
            "upper_limit": [5, 10]
        },
        {
            "label": "Get - Missing",
            "comment": "???",
            "unit": "ms",
            "format": "0,0.00",
            "formula": "indices.get.missing_time_in_millis / indices.get.missing_total",
            "formula_keys": "indices.get.missing_time_in_millis@@indices.get.missing_total",
            "upper_limit": [2, 5]

        },
        {
            "label": "Refresh",
            "comment": "High values indicate slow I/O.",
            "unit": "ms",
            "format": "0,0.00",
            "formula": "indices.refresh.total_time_in_millis / indices.refresh.total",
            "formula_keys": "indices.refresh.total_time_in_millis@@indices.refresh.total",
            "upper_limit": [10, 20]

        },
        {
            "label": "Flush",
            "comment": "High values indicate slow I/O.",
            "unit": "ms",
            "format": "0,0.00",
            "formula": "indices.flush.total_time_in_millis / indices.flush.total",
            "formula_keys": "indices.flush.total_time_in_millis@@indices.flush.total",
            "upper_limit": [750, 1500]

        }
    ]


def memory_rules():
    return [
        {
            "label": "Total Memory",
            "unit": "0.00b",
            "format": "0,0.0",
            "formula": "( os.mem.used_in_bytes + os.mem.free_in_bytes ) / 1024 / 1024 / 1024",
            "formula_keys": "os.mem.used_in_bytes@@os.mem.free_in_bytes"
        },
        {
            "label": "Heap Size",
            "unit": "0.00b",
            "comment": "A heap size over 32GB causes the JVM to use uncompressed pointers and can slow GC.",
            "format": "0,0.0",
            "formula": "jvm.mem.heap_committed_in_bytes / 1024 / 1024 / 1024",
            "formula_keys": "jvm.mem.heap_committed_in_bytes",
            "upper_limit": [30, 32]
        },
        {
            "label": "Heap % of RAM",
            "comment": "Approx 40-50% of RAM should be available to the kernel for file caching.",
            "format": "0.000%",
            "formula": "jvm.mem.heap_committed_in_bytes / (os.mem.used_in_bytes + os.mem.free_in_bytes)",
            "formula_keys": "jvm.mem.heap_committed_in_bytes@@os.mem.used_in_bytes@@os.mem.free_in_bytes",
            "upper_limit": [0.6, 0.75]
        },
        {
            "label": "% Heap Used",
            "format": "0.000%",
            "formula": "jvm.mem.heap_used_in_bytes / jvm.mem.heap_committed_in_bytes",
            "formula_keys": "jvm.mem.heap_used_in_bytes@@jvm.mem.heap_committed_in_bytes"
        },
        {
            "label": "GC Young Generation Freq",
            "unit": "s",
            "comment": "Too frequent GC indicates memory pressure and need for more heap space.",
            "format": "0,0.0",
            "formula": "jvm.uptime_in_millis / jvm.gc.collectors.young.collection_count / 1000",
            "formula_keys": "jvm.uptime_in_millis@@jvm.gc.collectors.young.collection_count",
            "lower_limit": [30, 15, 0]
        },
        {
            "label": "GC Young Generation Duration",
            "comment": "Long durations may indicate that swapping is slowing down GC, or need for more heap space.",
            "unit": "ms",
            "format": "0,0.00",
            "formula": "jvm.gc.collectors.young.collection_time_in_millis / jvm.gc.collectors.young.collection_count",
            "formula_keys": "jvm.gc.collectors.young.collection_time_in_millis@@jvm.gc.collectors.young.collection_count",
            "upper_limit": [150, 400]
        },
        {
            "label": "GC Old Generation Freq",
            "unit": "s",
            "comment": "Too frequent GC indicates memory pressure and need for more heap space.",
            "format": "0,0.0",
            "formula": "jvm.uptime_in_millis / jvm.gc.collectors.old.collection_count / 1000",
            "formula_keys": "jvm.uptime_in_millis@@jvm.gc.collectors.old.collection_count",
            "lower_limit": [30, 15, 0]
        },
        {
            "label": "GC Old Generation Duration",
            "comment": "Long durations may indicate that swapping is slowing down GC, or need for more heap space.",
            "unit": "ms",
            "format": "0,0.00",
            "formula": "jvm.gc.collectors.old.collection_time_in_millis / jvm.gc.collectors.old.collection_count",
            "formula_keys": "jvm.gc.collectors.old.collection_time_in_millis@@jvm.gc.collectors.old.collection_count",
            "upper_limit": [150, 400]
        },
        {
            "label": "Swap Space",
            "formula": "os.swap.used_in_bytes / 1024 / 1024",
            "formula_keys": "os.swap.used_in_bytes",
            "format": "0.00b",
            "upper_limit": [1, 1],
            "comment": "Any use of swap by the JVM, no matter how small, can greatly impact the speed of the garbage collector."
        }
    ]


def network_rules():
    return [
        {
            "label": "HTTP Connection Rate",
            "unit": "/second",
            "comment": "Too many HTTP connections per second may exhaust the number of sockets available in the kernel, and cause a service outage.",
            "format": "0,0.0",
            "value": "httpconnectrate",
            "upper_limit": [5, 30],
            "formula": "http.total_opened / jvm.uptime_in_millis * 1000",
            "formula_keys": "http.total_opened@@jvm.uptime_in_millis"
        }
    ]
