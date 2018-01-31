==============
Developers API
==============

.. contents:: Table of Contents
   :depth: 5


Services
--------

ConnectionService
^^^^^^^^^^^^^^^^^


ClusterService
^^^^^^^^^^^^^^

.. automodule:: elastichq.service.ClusterService
   :members:

ClusterDBService
^^^^^^^^^^^^^^^^

IndicesService
^^^^^^^^^^^^^^

NodeService
^^^^^^^^^^^

Models
------

.. automodule:: elastichq.model.ClusterModel
   :members:

Response
--------

.. autofunction:: elastichq.common.api_response.APIResponse

Exceptions
----------

All ElasticHQ API endpoints are wrapped by a decorator that handles raised exceptions.

.. autofunction:: elastichq.common.exceptions.request_wrapper

.. autoclass:: elastichq.common.exceptions.ApiException
   :members:

.. autoclass:: elastichq.common.exceptions.NotFoundException

.. autoclass:: elastichq.common.exceptions.BadRequest

.. autoclass:: elastichq.common.exceptions.InternalServerError
