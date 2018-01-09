__author__ = 'royrusso'

# These settings are only used by the unittests

HQ_SITE_URL = 'http://elastichq.org'
HQ_GH_URL = 'https://github.com/ElasticHQ/elasticsearch-HQ'

# VERSION
API_VERSION = 'v3.0'

ES_V2_HOST = '127.0.0.1'
ES_V2_PORT = '9200'
ES_V5_HOST = '127.0.0.1'
ES_V5_PORT = '8200'
ES_V6_HOST = '127.0.0.1'
ES_V6_PORT = '7200'

ES_V2_CLUSTER = '{"ip": "%s", "port": "%s"}' % (ES_V2_HOST, ES_V2_PORT)
ES_V5_CLUSTER = '{"ip": "%s", "port": "%s"}' % (ES_V5_HOST, ES_V5_PORT)
ES_V6_CLUSTER = '{"ip": "%s", "port": "%s"}' % (ES_V6_HOST, ES_V6_PORT)

KEYS_CLUSTER_HEALTH = ['active_primary_shards', 'number_of_in_flight_fetch', 'number_of_data_nodes', 'number_of_nodes', 'delayed_unassigned_shards', 'unassigned_shards',
                       'number_of_pending_tasks', 'initializing_shards', 'cluster_name', 'task_max_waiting_in_queue_millis', 'timed_out', 'active_shards', 'relocating_shards',
                       'status', 'active_shards_percent_as_number']
KEYS_CLUSTER_STATE = ['nodes', 'metadata', 'blocks', 'master_node', 'version', 'state_uuid', 'cluster_name', 'routing_table', 'routing_nodes']

KEYS_CLUSTER_STATS = ['nodes', 'cluster_name', 'timestamp', 'status', 'indices']

KEYS_CLUSTER_PENDING_TASKS = ['tasks']

KEYS_CLUSTER_SETTINGS = ['persistent', 'transient']

KEYS_NODE_STATS = ['process', 'indices', 'jvm', 'transport', 'thread_pool', 'timestamp', 'name', 'ip', 'fs', 'host', 'os', 'breakers', 'script', 'http', 'transport_address']

KEYS_NODE_INFO = ['process', 'plugins', 'build', 'ip', 'modules', 'http_address', 'thread_pool', 'jvm', 'name', 'host', 'settings', 'os', 'transport', 'http', 'transport_address',
                  'version']
dict_keys(['os', 'process', 'modules', 'thread_pool', 'http', 'total_indexing_buffer', 'transport', 'ip', 'settings', 'jvm', 'version', 'build_hash', 'host', 'transport_address', 
           'ingest', 'roles', 'plugins', 'name'])