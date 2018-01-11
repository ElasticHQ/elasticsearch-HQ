__author__ = 'royrusso'
import time

from flask import g

from ..api import api
from .status_codes import HTTP_Status


def APIResponse(data, status_code=HTTP_Status.OK, headers=None, message=None):
    """
    Uniform response envelope
    :param data: 
    :param status_code: An HTTP code
    :param headers: 
    :param message: 
    :return:
    """
    if not isinstance(data, (list)):
        data = [data]

    diff = int((time.time() - g.start_request_timestamp) * 1000)
    formatted_response = {'data': data, 'status_code': status_code, 'message': message, 'response_time': diff}

    response = api.make_response(formatted_response, status_code)

    response.headers.add('Status', status_code)

    if headers is not None:
        response.headers.extend(headers)

    return response
