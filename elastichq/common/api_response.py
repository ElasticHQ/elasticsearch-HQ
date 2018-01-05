__author__ = 'royrusso'

from ..api import api
from .status_codes import HTTP_Status


def APIResponse(data, status_code=HTTP_Status.OK, headers=None, message=None):
    response = api.make_response(data, status_code)

    response.headers.add('Status', status_code)

    if headers is not None:
        response.headers.extend(headers)

    return response
