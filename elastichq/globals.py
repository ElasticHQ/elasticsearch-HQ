import json
import logging
import logging.config
import os
import sys

from flask_apscheduler import APScheduler
from flask_marshmallow import Marshmallow
from flask_migrate import Migrate
from flask_socketio import SocketIO
from flask_sqlalchemy import SQLAlchemy
from elastichq.common.TaskPool import TaskPool
from .utils import find_config
from .config import settings
from .vendor.elasticsearch.connections import Connections

__author__ = 'royrusso'

db = SQLAlchemy()
ma = Marshmallow()
migrate = Migrate()
scheduler = APScheduler()

socketio = SocketIO()
taskPool = TaskPool()


def init_marshmallow(app):
    ma.init_app(app)


def init_log():
    """
    Initializes log format and console/file appenders
    :return:
    """
    config = find_config('logger.json')
    logging.config.dictConfig(config)


def init_database(app, tests=False):
    db.init_app(app)
    app.app_context().push()

    if tests:  # miserable hack
        db.drop_all(app=app)

    # noinspection PyUnresolvedReferences
    import elastichq.model
    db.create_all(app=app)

    migrate.init_app(app, db)


def migrate_db(app):
    pass


#
# def init_scheduler(app):
#     scheduler.init_app(app)
#     scheduler.start()

def init_socketio(app):
    # Set this variable to "threading", "eventlet" or "gevent" to test the
    # different async modes, or leave it set to None for the application to choose
    # the best option based on installed packages.

    async_mode = 'eventlet'

    socketio.init_app(app, async_mode=async_mode, logger=True, engineio_logger=True)

    return socketio

def init_task_pool(socketio):
    taskPool.init_app(socketio)

LOG = logging.getLogger('elastichq')

# Global configurations loaded from setting file
CONFIG = settings

# Global connection pool to all clusters
CONNECTIONS = Connections()

# TODO: This has to be persisted and made configurable
REQUEST_TIMEOUT = 30



