from flask import Flask
import os

# noinspection PyUnresolvedReferences
from elastichq.api import api_blueprint, endpoints, public_blueprint, ws_blueprint
from elastichq.config.settings import ProdSettings, TestSettings
from elastichq.globals import init_cache, init_database, init_log, init_marshmallow, init_socketio, init_task_pool, init_connections #,init_scheduler

__author__ = 'royrusso'


def create_app(env='PROD'):
    app = Flask(__name__)

    if env.lower() == 'prod':
        app.config.from_object(ProdSettings())
    elif env.lower() == 'test':
        app.config.from_object(TestSettings())
    else:
        raise ValueError('Unknown environment: %s' % (env,))

    init_log(app)

    app.register_blueprint(api_blueprint)
    app.register_blueprint(public_blueprint)
    app.register_blueprint(ws_blueprint)

    app.jinja_env.auto_reload = True
    app.config['TEMPLATES_AUTO_RELOAD'] = True

    # Stop the app from initializing twice in debug mode.
    #    if not app.debug or os.environ.get("WERKZEUG_RUN_MAIN") == "true":
    # The app is not in debug mode or we are in the reloaded process
    init_database(app, tests=env.lower() == 'test')

    init_marshmallow(app)

    # Init connections, or all other startup inits that require active connections, will fail.
    init_connections()

    # TODO: For now as assume always in debug mode, so it doesn't execute the scheduler twice.
    #init_scheduler(app, True)

    socketio = init_socketio(app)

    init_task_pool(socketio)



    return app
