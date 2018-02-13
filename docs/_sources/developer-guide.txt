==============
For Developers
==============

.. contents:: Table of Contents
    :depth: 3
    :local:

Building Pre-Releases
---------------------

Pre-Releases are typically not built in a distributable format until the very end of the development cycle. For this reason,
pre-release versions have to be built manually - with the UI and API working in separate directories.

Install/Build the UI
~~~~~~~~~~~~~~~~~~~~

Navigate to the root directory of the project...

1. ``npm install``
2. ``npm start``
3. Server should be running on ``http://localhost:8080``

You still need to start the python server, but that is accomplished as normal:

1. ``pip install -r requirements.txt``
2. ``python application.py``

In this case, using a development version, the API will be running on port ``5000``, and the UI will be accessible on port ``8080``.

Building a Distribution
~~~~~~~~~~~~~~~~~~~~~~~

To build the final distribution that will have the UI and API accessible from port ``5000``, run ``npm run-script build``.

This will create an ``index.html`` that the Flask server will serve, under ``/elastichq/templates`` and static file bundles under ``/elastichq/static``.

Once the distribution is built, you can start the server with ``python application.py`` and view the application at ``http://localhost:5000``

Running Tests
-------------

1. ``/tests/scripts`` contains ``start_clusters.sh`` which will start up 3 ES clusters on ports 9200, 8200, 7200. These are versions 2.x, 5.x, and 6.x respectively.
2. Edit ``start_clusters.sh`` to point to your local ES binaries.
3. Source the virtual environment:

.. code-block:: bash

    source ../environments/elastichq/bin/activate

4. To run tests:

.. code-block:: bash

    elastichq/run_tests


Notes
~~~~~

* Coverage report will be appear under ``/tests/cover``.
* All tests will fail without those 3 clusters running. They are the 3 major versions that HQ currently supports.
* The scripts under ``/tests/scripts`` allow for starting, stopping, and listing all clusters. You will need to edit those for the tests to run.

Building Documentation
----------------------

``./sphinx-build -b html /path/to/docs/source /path/to/docs``

HTTP Responses
--------------

HTTP Status
~~~~~~~~~~~

All response codes are included in the HTTP Status response header. There are method-specific responses to take note of:

* POST - Returns ``201``
* PUT - Returns ``200``
* DELETE - Returns ``200``

Response Headers
~~~~~~~~~~~~~~~~

Standard header response below:

.. sourcecode:: http

    HTTP/1.1 200 OK
    Access-Control-Allow-Credentials: true
    Access-Control-Allow-Methods: POST, OPTIONS, GET, PUT, DELETE
    Access-Control-Allow-Origin: *
    Access-Control-Max-Age: 3600
    Allow: POST, GET, PUT, DELETE
    Content-Length: 4320
    Content-Type: application/json
    Date: Wed, 31 Jan 2018 22:54:08 GMT
    Server: Werkzeug/0.14.1 Python/3.5.0
    Status: 200
    X-HQ-Response-Time: 2570

Custom headers are pre-fixed with ``X-HQ``.

* X-HQ-Response-Time: The time, in milliseconds it took from request to response.

Issues/Bugs
-----------

Patches, bug reports, and feature requests are all welcome through the `GitHub site
<https://github.com/ElasticHQ/elasticsearch-HQ/>`_. Contributions in the form of patches or pull requests are easier to integrate and will receive priority attention.

