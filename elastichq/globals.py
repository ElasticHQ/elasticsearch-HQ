import json
import logging
import logging.config
import os

from flask_apscheduler import APScheduler
from flask_marshmallow import Marshmallow
from flask_migrate import Migrate
from flask_socketio import SocketIO
from flask_sqlalchemy import SQLAlchemy

from .config import settings
from .vendor.elasticsearch.connections import Connections

__author__ = 'royrusso'

db = SQLAlchemy()
ma = Marshmallow()
migrate = Migrate()
scheduler = APScheduler()
socketio = SocketIO()


def init_marshmallow(app):
    ma.init_app(app)


def init_log():
    """
    Initializes log format and console/file appenders
    :return:
    """
    project_root = os.path.split(os.path.dirname(os.path.abspath(__file__)))[0]

    logging.config.dictConfig(json.load(open(os.path.join(project_root, 'elastichq', 'config', 'logger.json'), 'r')))


def init_database(app, tests=False):
    db.init_app(app)

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
    # socketio = SocketIO(app)
    return socketio


LOG = logging.getLogger('elastichq')

# Global configurations loaded from setting file
CONFIG = settings

# Global connection pool to all clusters
CONNECTIONS = Connections()

# TODO: This has to be persisted and made configurable
REQUEST_TIMEOUT = 10


class TaskPool:
    """
    Websocket Task pool
    """
    tasks = []

    def add(self, task):
        self.tasks.append(task)

    def get_task_by_room_name(self, room_name):
        for task in self.tasks:
            if task.room_name == room_name:
                return task

    def get_tasks_by_cluster_name(self, cluster_name):
        for task in self.tasks:
            if task.cluster_name == cluster_name:
                return task

    def remove(self, room_name):
        task = self.get_task_by_room_name(room_name)
        task.stop()
        self.tasks.remove(task)

    def create_task(self, task):
        """
        Will create the task if one does not exist by that name. Once created, it is added to the global pool.
        :param task:
        :return:
        """
        if self.get_task_by_room_name(room_name=task.room_name) is None:
            socketio.start_background_task(target=task.run)
            taskPool.add(task)


taskPool = TaskPool()
