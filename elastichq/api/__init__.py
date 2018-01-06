__author__ = 'royrusso'

from flask import Blueprint
from flask_restful import Api

api_blueprint = Blueprint("api", __name__, url_prefix='/api')
api = Api(api_blueprint, catch_all_404s=True)


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
