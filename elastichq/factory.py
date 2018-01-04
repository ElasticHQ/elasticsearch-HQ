__author__ = 'royrusso'

from flask import Flask

from elastichq.api import endpoints


def create_app():
    app = Flask(__name__)

    return app
