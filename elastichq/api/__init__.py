__author__ = 'royrusso'
from flask import Blueprint, render_template
from flask_restful import Api
from flask import current_app
import requests

api_blueprint = Blueprint("api", __name__, url_prefix='/api')
api = Api(api_blueprint, catch_all_404s=True)

# much of this taken from this boilerplate: https://github.com/oleg-agapov/flask-vue-spa
# https://stackoverflow.com/questions/23327293/flask-raises-templatenotfound-error-even-though-template-file-exists
#public_blueprint = Blueprint("public", __name__, template_folder="../../templates", static_folder="../../static")
public_blueprint = Blueprint("public", __name__)


@public_blueprint.route('/', defaults={'path': 'index.html'})
@public_blueprint.route('/<path:path>')
def catch_all(path):
    return render_template("index.html")


@api_blueprint.after_request
def add_cors(resp):
    """ Ensure all responses have the CORS headers. This ensures any failures are also accessible
        by the client. """
    resp.headers['Access-Control-Allow-Origin'] = '*'
    resp.headers['Access-Control-Allow-Credentials'] = 'true'
    resp.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS, GET, PUT, DELETE'
    resp.headers['Allow'] = 'POST, GET, PUT, DELETE'
    if resp.headers.get('Access-Control-Max-Age') != '0':
        resp.headers['Access-Control-Max-Age'] = '3600'

    return resp
