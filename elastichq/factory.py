__author__ = 'royrusso'

from flask import Flask

from .api import api_blueprint
from .globals import init_log

# WARNING: Pycharm will remove this line when reformatting.
from .api import endpoints

def create_app():
    app = Flask(__name__)

    app.config.from_object('elastichq.config.settings')

    app.register_blueprint(api_blueprint)

    init_log()

    return app
