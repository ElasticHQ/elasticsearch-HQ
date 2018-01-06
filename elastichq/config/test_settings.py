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

TEST_CLUSTER_NAMES = ['AA', 'BB', 'CC']
TEST_INDICES_NAMES = ['I1', 'I2', 'I3']
