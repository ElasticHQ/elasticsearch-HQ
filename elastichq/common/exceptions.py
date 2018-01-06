from functools import wraps

from flask import jsonify

from ..common.status_codes import HTTP_Status
from ..globals import LOG
from ..vendor.elasticsearch.connections import ConnectionNotFoundException


def request_wrapper(functor, message="Oops! Something bad happened."):
    """
    Standardizes error handling across the app
    
    :param functor: 
    :return:
    """
    if isinstance(functor, str):
        return lambda _: request_wrapper(_, message=functor)

    @wraps(functor)
    def _request_wrapper(*args, **kwargs):
        try:
            return functor(*args, **kwargs)
        except ApiException as ex:
            return ex.to_response()
        except ConnectionNotFoundException as ex:
            LOG.exception(ex.message)
            return ApiException(message=ex.message, status_code=HTTP_Status.NOT_FOUND).to_response()
        except Exception as e:
            exception_message = message or 'Error performing request'
            LOG.exception(exception_message)
            return ApiException(message=exception_message, status_code=HTTP_Status.INTERNAL_SERVER_ERROR).to_response()

    return _request_wrapper


class ApiException(Exception):
    def __init__(self, message, status_code=HTTP_Status.INTERNAL_SERVER_ERROR):
        super().__init__()
        self.message = message
        self.status_code = status_code

    def to_response(self):
        response = jsonify({"message": self.message, "status_code" : self.status_code})
        response.status_code = self.status_code
        response.headers.add('Status', self.status_code)

        return response


class NotFoundException(ApiException):
    def __init__(self, message, status_code=HTTP_Status.NOT_FOUND):
        super().__init__(message, status_code)


class BadRequest(ApiException):
    def __init__(self, message, status_code=HTTP_Status.BAD_REQUEST):
        super().__init__(message, status_code)


class InternalServerError(ApiException):
    def __init__(
            self, message='Internal Server Error',
            status_code=HTTP_Status.NOT_IMPLEMENTED):
        super().__init__(message, status_code)
