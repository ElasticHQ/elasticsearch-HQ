__author__ = 'royrusso'

import os

from flask import Flask

from elastichq.api import api_blueprint, public_blueprint
from elastichq.globals import init_log, init_database, init_marshmallow, init_scheduler


# noinspection PyUnresolvedReferences
from elastichq.api import endpoints


def create_app(test=False):
    app = Flask(__name__)

    if test is True:
        app.config.from_object('elastichq.config.test_settings')
    else:
        app.config.from_object('elastichq.config.settings')

    init_log()

    app.register_blueprint(api_blueprint)
    app.register_blueprint(public_blueprint)

    app.jinja_env.auto_reload = True
    app.config['TEMPLATES_AUTO_RELOAD'] = True

    # Stop the app from initializing twice in debug mode.
    if not app.debug or os.environ.get("WERKZEUG_RUN_MAIN") == "true":
        # The app is not in debug mode or we are in the reloaded process

        init_database(app, tests=test)

        init_marshmallow(app)

        init_scheduler(app)

    return app
