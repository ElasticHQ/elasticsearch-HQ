__author__ = 'royrusso'

from ..api import api
from .status_codes import HTTP_Status


def APIResponse(data, status_code=HTTP_Status.OK, headers=None, message=None):
    if not isinstance(data, (list)):
        data = [data]

    formatted_response = {'data': data, 'status_code': status_code, 'message': message}

    response = api.make_response(formatted_response, status_code)

    response.headers.add('Status', status_code)

    if headers is not None:
        response.headers.extend(headers)

    return response
