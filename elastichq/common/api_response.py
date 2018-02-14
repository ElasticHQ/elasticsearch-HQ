"""
.. module:: apiresponse

.. moduleauthor:: Roy Russo <royrusso.gmail.com>
"""

import time

from flask import g

from .status_codes import HTTP_Status
from ..api import api


def APIResponse(data, status_code=HTTP_Status.OK, headers=None, message=None):
    """
    Uniform response envelope

    :param data: Typically an array of dicts to be returned in the JSON output
    :param status_code: An HTTP code
    :param headers: 
    :param message: If an error or success message is added.
    :return: A Flask-RESTFul response
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
