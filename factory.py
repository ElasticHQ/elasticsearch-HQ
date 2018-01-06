__author__ = 'royrusso'

from flask import Flask

from elastichq.api import api_blueprint, public_blueprint
from elastichq.globals import init_log

# WARNING: Pycharm will remove this line when reformatting.
from elastichq.api import endpoints

def create_app():
    app = Flask(__name__)

    app.config.from_object('elastichq.config.settings')

    app.register_blueprint(api_blueprint)
    app.register_blueprint(public_blueprint)

    app.jinja_env.auto_reload = True
    app.config['TEMPLATES_AUTO_RELOAD'] = True

    init_log()

    return app
