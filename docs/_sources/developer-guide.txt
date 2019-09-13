==============
For Developers
==============

.. contents:: Table of Contents
    :depth: 3
    :local:

Contributing
------------

Please read the `Contributing guidelines <https://github.com/ElasticHQ/elasticsearch-HQ/blob/master/CONTRIBUTING.md>`_ before working on a pull request.

Note that new features and bug fixes should be performed from `develop` and on a new feature branch for the pull request to be manageable.

Developer Environment
---------------------

Set Debug to True
~~~~~~~~~~~~~~~~~

It is preferred that while developing, ``debug`` be set to True, by starting the application with ``python application.py -d True``. 

This will guarantee that any code changes will immediately refresh the application and cause it to start again with the new changes.

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

Pulling a tag from DockerHub
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The ``develop`` branch is automatically built on dockerhub. If you wish to test using this tag, which is latest unstable:

.. code-block:: bash

    docker run -p 5000:5000 elastichq/elasticsearch-hq:develop

Running Tests
-------------

All tests run using docker containers for specific versions of ES. Running the entire suite will run against all containers, one at a time.

To run all tests across all ES major versions:

.. code-block:: bash

    ./run-tests.sh

To run tests for a specific major version of ES:

.. code-block:: bash

    python manage.py run-tests --esv=<MAJOR_VERSION>

Manual Testing
--------------

The code repo contains docker compose files for testing against different Elasticsearch versions.

You can run these individually and then use the applicaiton to test against it:

.. code-block:: bash

    cd /tests/local/v2
    docker-compose up

Or you can run them all at once and test against them:

.. code-block:: bash

    cd /tests/local
    ./run_es_versions.sh

To bring the containers down:

.. code-block:: bash

    ./kill_es_versions.sh

In the event of errors to the effect of "container name in use", list the containers and remove them. This will remove all stopped containers:

.. code-block:: bash

    docker container ls
    docker container prune

Notes
~~~~~

* Coverage report will be appear under ``/tests/htmlcov``.
* HTML report of pytest output will appear under ``/tests/htmlout``

Building Documentation
----------------------

Sphinx requires specific libraries that are not in the default ``requirements.txt``.

First install the sphinx requirements: ``pip install -r sphinx-requirements.txt``

To generate the documentation:

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

