===============
Getting Started
===============

.. contents:: Table of Contents
    :depth: 3
    :local:



Quick-Start Guide
-----------------


Installation
------------

Requirements
^^^^^^^^^^^^

* Python 3.4+
* Elasticsearch. Supported versions: 2.x, 5.x, 6.x

Install ElasticHQ
^^^^^^^^^^^^^^^^^

1. Download or clone the repository https://github.com/ElasticHQ/elasticsearch-HQ
2. Navigate to the root of the repository: ``pip install -r requirements.txt``
3. Start the server: ``python application.py``
4. Point your browser to: http://localhost:5000

.. note:: Alternatively, you can start the server with ``python manage.py runserver``

Pre-Releases
^^^^^^^^^^^^

Pre-release versions are made available as branches in the github repository. We use GitFlow methodology and adhere to semantic versioning.

Our branching organization is as follows:

* ``master``: contains Latest Stable
* ``develop``: contains latest features and fixes. **Not stable.**
* ``#.#.#RC-#``: Release candidates are pre-release versions. **Not stable.**

Configuration
-------------


Logging
^^^^^^^

ElasticHQ logs out to console by default. You can change this, and log to file, by modifying the logging configuration.

Logging configuration is kept under ``elastichq/config/logger.json``. To have ElasticHQ log to file, change the root logger from:

.. code-block:: json

    {
        "root": {
            "level": "DEBUG",
            "handlers": [
              "console"
            ]
        }
    }

To:

.. code-block:: json

    {
        "root": {
            "level": "DEBUG",
            "handlers": [
              "standard_handler"
            ]
        }
    }

You can also adjust the log level to INFO, WARN, or ERROR there as well.


Database
^^^^^^^^

ElasticHQ ships with SQLLite integration to store clusters you have connected to and other meta information. This database is kept under the root directory as ``elastichq.db``.

.. note:: In the event you want to start with a clean slate, simply delete the ``elastichq.db`` file. ElasticHQ will recreate it at next startup.

Directory Structure
^^^^^^^^^^^^^^^^^^^

TODO

Upgrading
---------

We adhere to semantic versioning, so as long as the Major version hasn't changed, you can expect everything to work well enough. ;-)

Latest Version
^^^^^^^^^^^^^^

ElasticHQ checks against the Elastichq.org website, to retrieve the latest stable version number. You can see the check in the footer:

**Versions Match:**


.. figure::  /_static/img/footer_version_1.png
    :width: 600px
    :align: center



**Time to Upgrade:**


.. figure::  /_static/img/footer_version_2.png
    :width: 600px
    :align: center


Upgrading Minor and Patch versions
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

1. To upgrade, simply download or clone the repository master branch.
2. Upgrade the database: ``python manage.py db upgrade``
3. (Re)Start the server: ``python application.py``
4. Point your browser to: http://localhost:5000

License
-------

Copyright 2013-2018 Roy Russo and Authors

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

