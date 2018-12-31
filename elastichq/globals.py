import logging
import logging.config

from dogpile.cache import make_region
from dogpile.cache.proxy import ProxyBackend
from flask_marshmallow import Marshmallow
from flask_migrate import Migrate
from flask_socketio import SocketIO
from flask_sqlalchemy import SQLAlchemy

from elastichq.common.TaskPool import TaskPool
from .config import settings
from .utils import find_config
from .vendor.elasticsearch.connections import Connections

__author__ = 'royrusso'

db = SQLAlchemy()
ma = Marshmallow()
migrate = Migrate()
# scheduler = APScheduler(BackgroundScheduler())

socketio = SocketIO()
taskPool = TaskPool()


def init_marshmallow(app):
    ma.init_app(app)


def init_log(app):
    """
    Initializes log format and console/file appenders
    :return:
    """
    config = find_config('logger.json')
    logging.config.dictConfig(config)


def init_database(app, tests=False):
    # Added assignment, db.app=app, to stop: "RuntimeError: application not registered on db instance and no application bound to current context"
    # http://piotr.banaszkiewicz.org/blog/2012/06/29/flask-sqlalchemy-init_app/
    db.app = app
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


def init_connections():
    """
    Inits connections to all of the configured clusters.
    :return:
    """
    from elastichq.service import ClusterService
    ClusterService().get_clusters()


# def init_scheduler(app, debug=True):
#     """
#     Two criteria here... 1/ with gunicorn we explicitly add a job, as this function will only be called once because use_reloader=False.
#     With wsgi, we have to filter out the second call, so we don't create the same job twice.
#     :param app:
#     :param debug: assume true so we don't start the same job twice.
#     :return:
#     """
#     is_gunicorn = "gunicorn" in os.environ.get("SERVER_SOFTWARE", "")
#     if is_gunicorn:
#         scheduler.init_app(app)
#         scheduler.start()
#
#         from elastichq.common.JobPool import JobPool
#         job = JobPool().init_app(app=app)
#         job.blah()
#     else:
#         if not debug or os.environ.get('WERKZEUG_RUN_MAIN') == 'true':
#             if not scheduler.running:
#                 scheduler.init_app(app)
#                 scheduler.start()
#                 from elastichq.common.JobPool import JobPool
#                 job = JobPool().init_app(app=app)
#                 job.blah()


def init_socketio(app):
    # Set this variable to "threading", "eventlet" or "gevent" to test the
    # different async modes, or leave it set to None for the application to choose
    # the best option based on installed packages.
    async_mode = 'eventlet'
    socketio.init_app(app, async_mode=async_mode, logger=True, engineio_logger=True)
    return socketio


def init_task_pool(socketio):
    taskPool.init_app(socketio)


class CacheLoggingProxy(ProxyBackend):
    def set(self, key, value):
        LOG.info('Setting Cache Key: %s' % key)
        self.proxied.set(key, value)

    def get(self, key):
        LOG.info('Getting Cache Key: %s' % key)
        return self.proxied.get(key)

    def delete(self, key):
        LOG.info('Deleting Cache Key: %s' % key)
        return self.proxied.delete(key)


def init_cache():
    # TODO: make env configurable, for testing. Will likely require us to set an ENV when running tests.
    # default
    CACHE_REGION = make_region().configure(
        CONFIG.ProdSettings.DEFAULT_CACHE_BACKEND,
        expiration_time=CONFIG.ProdSettings.DEFAULT_CACHE_EXPIRE_TIME,
        arguments={
            'distributed_lock': CONFIG.ProdSettings.DEFAULT_CACHE_ARGUMENTS['distributed_lock']
        }, wrap=[CacheLoggingProxy]
    )
    return CACHE_REGION


LOG = logging.getLogger('elastichq')

# Global configurations loaded from setting file
CONFIG = settings

# Global connection pool to all clusters
CONNECTIONS = Connections()

# TODO: This has to be persisted and made configurable
REQUEST_TIMEOUT = 30

CACHE_REGION = init_cache()
