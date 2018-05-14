# make sure to use eventlet and call eventlet.monkey_patch()
import json

import eventlet
import jmespath

from elastichq.service import HQService, NodeService
from ..globals import LOG, socketio

eventlet.monkey_patch()


class Task:
    """
    Websocket background thread that broadcasts to a room.
    """

    # room_name == Task Name. Unique identifier
    room_name = None
    cluster_name = None
    metric = None
    task_timeout = 3
    sessions = []

    switch = False

    def __init__(self, room_name, cluster_name, metric):
        self.switch = True

        self.room_name = room_name
        self.cluster_name = cluster_name
        self.metric = metric
        self.loop_delay = HQService().get_settings(self.cluster_name).get('websocket_interval', 5)

    def remove_session(self, session_id):
        self.sessions.remove(session_id)
        LOG.debug("Removing client: " + session_id)

    def add_session(self, session_id):
        self.sessions.append(session_id)

    def run(self):
        """
        Based on Flask-SocketIO exapmle app at:
        https://github.com/miguelgrinberg/Flask-SocketIO/blob/master/example/app.py

        https://github.com/miguelgrinberg/Flask-SocketIO/issues/117

        :param kwargs:
        :return:
        """

        loop_count = 0

        # https://stackoverflow.com/questions/44371041/python-socketio-and-flask-how-to-stop-a-loop-in-a-background-thread
        while self.switch:

            # automatically stop this task when the room is empty
            if len(self.sessions) == 0:
                self.stop()

            if loop_count > 5:
                eventlet.sleep(self.loop_delay)

            LOG.debug('-----------------------------------------')
            LOG.debug('    Doing background task')
            LOG.debug('    SocketIO: {}'.format(hex(id(socketio))))
            LOG.debug('    SocketIO rooms: {}'.format(socketio.server.manager.rooms))
            LOG.debug('-----------------------------------------')

            if self.metric == 'nodes':
                try:
                    node_stats = NodeService().get_node_stats(self.cluster_name, request_timeout=self.task_timeout)
                    node_ids = list(node_stats['nodes'].keys())
                    nodes = []
                    for node_id in node_ids:
                        node_dict = node_stats['nodes'][node_id]

                        available_in_bytes = jmespath.search("fs.data[0].available_in_bytes", node_dict) or 0
                        total_in_bytes = jmespath.search("fs.data[0].total_in_bytes", node_dict) or 0

                        node = \
                            {
                                "node_id": node_id,
                                "name": jmespath.search("name", node_dict),
                                "host": jmespath.search("host", node_dict),
                                "heap_max_in_bytes": jmespath.search("jvm.mem.heap_max_in_bytes", node_dict),
                                "heap_used_in_bytes": jmespath.search("jvm.mem.heap_used_in_bytes", node_dict),
                                "docs_count": jmespath.search("indices.docs.count", node_dict),
                                "docs_deleted": jmespath.search("indices.docs.deleted", node_dict),
                                "store_size": jmespath.search("indices.store.size_in_bytes", node_dict),
                                "cpu_percent": jmespath.search("process.cpu.percent", node_dict),
                                "field_data_cache_in_bytes": jmespath.search("indices.fielddata.memory_size_in_bytes",
                                                                             node_dict),
                                "fs_used_in_bytes": total_in_bytes - available_in_bytes,
                                "fs_free_in_bytes": available_in_bytes,
                                "index_total": jmespath.search("indices.indexing.index_total", node_dict),

                                # JVM
                                "jvm_gc_old_count": jmespath.search("jvm.gc.collectors.old.collection_count",
                                                                    node_dict),
                                "jvm_gc_young_count": jmespath.search("jvm.gc.collectors.young.collection_count",
                                                                      node_dict),
                                "jvm_threads_count": jmespath.search("jvm.threads.count", node_dict),

                                # Transport
                                "transport_rx_count": jmespath.search("transport.rx_count", node_dict),
                                "transport_rx_size_in_bytes": jmespath.search("transport.rx_size_in_bytes", node_dict),
                                "transport_tx_count": jmespath.search("transport.tx_count", node_dict),
                                "transport_tx_size_in_bytes": jmespath.search("transport.tx_size_in_bytes", node_dict),
                                "http_current_open": jmespath.search("http.current_open", node_dict),
                                "http_total_opened": jmespath.search("http.total_opened", node_dict),

                                # OS
                                "os_load_average": jmespath.search("os.load_average", node_dict),
                                "os_cpu_percent": jmespath.search("os.cpu_percent", node_dict),
                                "os_mem_free_in_bytes": jmespath.search("os.mem.free_in_bytes", node_dict),
                                "os_mem_used_in_bytes": jmespath.search("os.mem.used_in_bytes", node_dict),
                                "os_swap_free_in_bytes": jmespath.search("os.swap.free_in_bytes", node_dict),
                                "os_swap_used_in_bytes": jmespath.search("os.swap.used_in_bytes", node_dict),
                                "process_open_file_descriptors": jmespath.search("process.open_file_descriptors",
                                                                                 node_dict),

                                # Thread Pools
                                "tp_bulk_completed": jmespath.search("thread_pool.bulk.completed", node_dict),
                                "tp_bulk_queue": jmespath.search("thread_pool.bulk.queue", node_dict),
                                "tp_get_completed": jmespath.search("thread_pool.get.completed", node_dict),
                                "tp_get_queue": jmespath.search("thread_pool.get.queue", node_dict),
                                "tp_index_completed": jmespath.search("thread_pool.index.completed", node_dict),
                                "tp_index_queue": jmespath.search("thread_pool.index.queue", node_dict),
                                "tp_search_completed": jmespath.search("thread_pool.search.completed", node_dict),
                                "tp_search_queue": jmespath.search("thread_pool.search.queue", node_dict),

                                # Indexing
                                "indexing_total": jmespath.search("indices.indexing.index_total", node_dict),
                                "indexing_failed": jmespath.search("indices.indexing.index_failed", node_dict),
                                "delete_total": jmespath.search("indices.indexing.delete_total", node_dict),

                                # Fetching
                                "get_total": jmespath.search("indices.get.total", node_dict),
                                "fetch_total": jmespath.search("indices.search.fetch_total", node_dict),
                                "exists_total": jmespath.search("indices.get.exists_total", node_dict),
                                "missing_total": jmespath.search("indices.get.missing_total", node_dict),
                                "query_total": jmespath.search("indices.search.query_total", node_dict),
                                "scroll_total": jmespath.search("indices.search.scroll_total", node_dict),

                                "cache_fd_evictions": jmespath.search("indices.fielddata.evictions", node_dict),
                                "cache_fd_memory_size_in_bytes": jmespath.search(
                                    "indices.fielddata.memory_size_in_bytes", node_dict),

                                "cache_qc_hit_count": jmespath.search("indices.query_cache.hit_count", node_dict),
                                "cache_qc_memory_size_in_bytes": jmespath.search(
                                    "indices.query_cache.memory_size_in_bytes", node_dict),
                                "cache_qc_miss_count": jmespath.search("indices.query_cache.miss_count", node_dict),
                                "cache_qc_cache_size": jmespath.search("indices.query_cache.cache_size", node_dict),
                                "cache_qc_cache_count": jmespath.search("indices.query_cache.cache_count", node_dict),
                                "cache_qc_evictions": jmespath.search("indices.query_cache.evictions", node_dict)

                            }
                        nodes.append(node)
                    LOG.debug("Broadcast to room: " + self.room_name)

                    socketio.emit('event', {'data': json.dumps(nodes)}, room=self.room_name, namespace="/ws")

                except Exception as ex:
                    LOG.error("Error fetching node metrics!", ex)

                loop_count += 1
            else:
                pass

    def stop(self):
        self.switch = False
        LOG.debug("Task Stopped: " + self.room_name)
