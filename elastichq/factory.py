import os
from flask import Flask
from elastichq.api import api_blueprint, public_blueprint, ws_blueprint
from elastichq.globals import init_log, init_database, init_marshmallow, init_scheduler, init_socketio
from elastichq.config.settings import ProdSettings, TestSettings

# noinspection PyUnresolvedReferences
from elastichq.api import endpoints


__author__ = 'royrusso'


def create_app(env='PROD', port=5000, host='127.0.0.1', debug=True):
    app = Flask(__name__)

    if env.lower() == 'prod':
        app.config.from_object(ProdSettings())
    elif env.lower() == 'test':
        app.config.from_object(TestSettings())
    else:
        raise ValueError('Unknown environment: %s' % (env, ))

    init_log()

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

    socketio = init_socketio(app)
    socketio.run(app, port=port, host=host, debug=debug)
    #socketio.run(app, port=port, host=host)

    #init_scheduler(app)

    return app
