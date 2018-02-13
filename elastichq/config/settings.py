import json
import os
from functools import lru_cache

from apscheduler.jobstores.memory import MemoryJobStore

__author__ = 'wmcginnis'

_search_paths = [
    './elastichq.json',
    './elastichq/elastichq.json',
    './elastichq/config/elastichq.json',
    '~/elastichq.json'
]


class BaseSettings:
    """
    BaseSettings is the base class for all other settings objects. It exposes properties that parse out the default vs.
    overrides for any user-settable configuration options.
    """

    @lru_cache(1)
    def _user_config(self):
        for sp in _search_paths:
            try:
                with open(sp, 'r') as f:
                    config = json.load(f)
                    return config
            except FileNotFoundError:
                pass
        return dict()

    @property
    def SQLALCHEMY_DATABASE_URI(self):
        return self._user_config().get('SQLALCHEMY_DATABSE_URI', self._sqlalchemy_database_uri)

    @property
    def SCHEDULER_API_ENABLED(self):
        return self._user_config().get('SCHEDULER_API_ENABLED', self._scheduler_api_enabled)

    @property
    def SQLALCHEMY_TRACK_MODIFICATIONS(self):
        return self._user_config().get('SQLALCHEMY_TRACK_MODIFICATIONS', self._sqlalchemy_track_modifications)


class TestSettings(BaseSettings):
    # top level
    BASEPATH = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

    # user configurable
    _sqlalchemy_database_uri = 'sqlite:///' + os.path.join(BASEPATH, 'test_elastichq.db')
    _scheduler_api_enabled = False
    _sqlalchemy_track_modifications = False

    # static
    HQ_SITE_URL = 'http://elastichq.org'
    HQ_GH_URL = 'https://github.com/ElasticHQ/elasticsearch-HQ'
    API_VERSION = 'v3.0'
    ES_V2_HOST = '127.0.0.1'
    ES_V2_PORT = '9200'
    ES_V5_HOST = '127.0.0.1'
    ES_V5_PORT = '8200'
    ES_V6_HOST = '127.0.0.1'
    ES_V6_PORT = '7200'
    ES_V6_USERNAME = 'elastic'
    ES_V6_PASSWORD = 'Gm4UAvzFWlK7PupHxjPs'

    # Cluster URL is used in the text fixture, for easy connections using lib requests.
    ES_V2_CLUSTER_URL = 'http://%s:%s' % (ES_V2_HOST, ES_V2_PORT)
    ES_V5_CLUSTER_URL = 'http://%s:%s' % (ES_V5_HOST, ES_V5_PORT)
    ES_V6_CLUSTER_URL = 'http://%s:%s@%s:%s' % (ES_V6_USERNAME, ES_V6_PASSWORD, ES_V6_HOST, ES_V6_PORT)

    # Cluster connect strings are passed to /_connect endpoint to initiate pools
    ES_V2_CLUSTER_CONNECT = '{"ip": "%s", "port": "%s"}' % (ES_V2_HOST, ES_V2_PORT)
    ES_V5_CLUSTER_CONNECT = '{"ip": "%s", "port": "%s"}' % (ES_V5_HOST, ES_V5_PORT)
    ES_V6_CLUSTER_CONNECT = '{"ip": "%s", "port": "%s", "username" : "%s", "password" : "%s"}' % (
        ES_V6_HOST, ES_V6_PORT, ES_V6_USERNAME, ES_V6_PASSWORD)

    # Key matching: For tests, we enforce that all responses, regardless of ES version contain the same keys.
    KEYS_CLUSTER_HEALTH = ['active_primary_shards', 'number_of_in_flight_fetch', 'number_of_data_nodes',
                           'number_of_nodes', 'delayed_unassigned_shards', 'unassigned_shards',
                           'number_of_pending_tasks', 'initializing_shards', 'cluster_name',
                           'task_max_waiting_in_queue_millis', 'timed_out', 'active_shards', 'relocating_shards',
                           'status', 'active_shards_percent_as_number']
    KEYS_CLUSTER_STATE = ['nodes', 'metadata', 'blocks', 'master_node', 'version', 'state_uuid', 'cluster_name',
                          'routing_table', 'routing_nodes']
    KEYS_CLUSTER_STATS = ['nodes', 'cluster_name', 'timestamp', 'status', 'indices']
    KEYS_CLUSTER_SUMMARY = ['number_of_in_flight_fetch', 'status', 'timed_out', 'number_of_documents', 'cluster_name',
                            'active_primary_shards', 'delayed_unassigned_shards',
                            'relocating_shards', 'number_of_data_nodes', 'active_shards', 'initializing_shards',
                            'active_shards_percent_as_number', 'number_of_nodes',
                            'task_max_waiting_in_queue_millis', 'version', 'nodes', 'unassigned_shards',
                            'indices_size_in_bytes', 'indices_count', 'number_of_pending_tasks']
    KEYS_CLUSTER_PENDING_TASKS = ['tasks']
    KEYS_CLUSTER_SETTINGS = ['persistent', 'transient']
    KEYS_NODE_STATS = ['process', 'indices', 'jvm', 'transport', 'thread_pool', 'timestamp', 'name', 'ip', 'fs', 'host',
                       'os', 'breakers', 'script', 'http', 'transport_address']
    KEYS_NODE_INFO = ['process', 'plugins', 'build', 'ip', 'modules', 'http_address', 'thread_pool', 'jvm', 'name',
                      'host', 'settings', 'os', 'transport', 'http', 'transport_address',
                      'version']
    KEYS_NODE_SUMMARY_FS = ['mount', 'path', 'type', 'free_in_bytes', 'available_in_bytes', 'total_in_bytes']
    KEYS_NODE_SUMMARY_JVM = ['heap_used_in_bytes', 'non_heap_committed_in_bytes', 'non_heap_used_in_bytes',
                             'heap_committed_in_bytes', 'heap_max_in_bytes', 'pools', 'heap_used_percent']


class ProdSettings(BaseSettings):
    # top level
    BASEPATH = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

    # user configurable
    _sqlalchemy_database_uri = 'sqlite:///' + os.path.join(BASEPATH, 'elastichq.db')
    _scheduler_api_enabled = True
    _sqlalchemy_track_modifications = False

    # static
    HQ_SITE_URL = 'http://elastichq.org'
    HQ_GH_URL = 'https://github.com/ElasticHQ/elasticsearch-HQ'
    API_VERSION = '3.0.0'
    SCHEDULER_JOBSTORES = {
        'default': MemoryJobStore()
    }
