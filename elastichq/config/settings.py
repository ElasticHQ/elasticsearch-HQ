__author__ = 'royrusso'

from apscheduler.jobstores.memory import MemoryJobStore
import os

HQ_SITE_URL = 'http://elastichq.org'
HQ_GH_URL = 'https://github.com/ElasticHQ/elasticsearch-HQ'

# VERSION
API_VERSION = 'v3.0'

BASEPATH = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(BASEPATH, 'elastichq.db')
SQLALCHEMY_TRACK_MODIFICATIONS = False  # deprecation warning
# SQLALCHEMY_MIGRATE_REPO = os.path.join(BASEPATH, 'db_repository')

SCHEDULER_JOBSTORES = {
    'default': MemoryJobStore()
}

SCHEDULER_API_ENABLED = True
