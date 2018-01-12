__author__ = 'royrusso'
import logging.config
import logging
import json
import os

from flask_marshmallow import Marshmallow

from flask_sqlalchemy import SQLAlchemy

from flask_apscheduler import APScheduler

from .vendor.elasticsearch.connections import Connections
from .config import settings

db = SQLAlchemy()
ma = Marshmallow()
scheduler = APScheduler()


def init_marshmallow(app):
    ma.init_app(app)


def init_log():
    """
    Initializes log format and console/file appenders
    :return:
    """
    project_root = os.path.split(os.path.dirname(os.path.abspath(__file__)))[0]

    logging.config.dictConfig(json.load(open(project_root + str(os.sep) + 'elastichq' + str(os.sep) + 'config' + str(os.sep) + 'logger.json', 'r')))


def init_database(app, tests=False):
    db.init_app(app)

    if tests is True:  # miserable hack
        db.drop_all(app=app)

    # noinspection PyUnresolvedReferences
    import elastichq.model

    db.create_all(app=app)


from datetime import datetime


def tick():
    print('Tick! The time is: %s' % datetime.now())


def init_scheduler(app):
    scheduler.init_app(app)
    scheduler.start()


LOG = logging.getLogger('elastichq')

# Global configurations loaded from setting file
CONFIG = settings

# Global connection pool to all clusters
CONNECTIONS = Connections()

# TODO: This has to be persisted and made configurable
REQUEST_TIMEOUT = 10
