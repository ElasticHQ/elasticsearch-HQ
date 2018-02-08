===============
Getting Started
===============

.. contents:: Table of contents
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

.. note:: Alternatively, you can start the server with ``python manage.py runserver``

4. Point your browser to: http://localhost:5000

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


License
-------

Copyright 2013-2018 Roy Russo

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.


.. Requirements
.. 1~~~~~~~~~~~~

Proin ac mi tempor, ullamcorper ante at, sodales augue. Duis enim turpis,
volutpat eget consectetur id, facilisis vel nisl. Sed non leo aliquam, tempus
nisl eu, vestibulum enim. Suspendisse et leo imperdiet, pulvinar lacus sed,
commodo felis.

.. note::

  Praesent elit mi, pretium nec pellentesque eget, ultricies
  euismod turpis.



In lobortis elementum tempus. Nam facilisis orci neque, eget vestibulum lectus
imperdiet sed. Aenean ac eros sollicitudin, accumsan turpis ac, faucibus arcu.



Donec sodales, velit ac sagittis fermentum, metus ante pharetra ex, ac eleifend
erat ligula in lacus. Donec tincidunt urna est, non mollis turpis lacinia sit
amet. Duis ac facilisis libero, ut interdum nibh. Sed rutrum dapibus pharetra.
Ut ac luctus nisi, vitae volutpat arcu. Vivamus venenatis eu nibh ut
consectetur. Cras tincidunt dui nisi, et facilisis eros feugiat nec.

Fusce ante:

- libero
- consequat quis facilisis id
- sollicitudin et nisl.

Aliquam diam mi, vulputate nec posuere id, consequat id elit. Ut feugiat lectus
quam, sed aliquet augue placerat nec. Sed volutpat leo ac condimentum
ullamcorper. Vivamus eleifend magna tellus, sit amet porta nunc ultrices eget.
Nullam id laoreet ex. Nam ultricies, ante et molestie mollis, magna sem porta
libero, sed molestie neque risus ut purus. Ut tellus sapien, auctor a lacus eu,
iaculis congue ex.

Duis et nisi a odio **scelerisque** sodales ac ut sapien. Ut eleifend blandit
velit luctus euismod. Curabitur at pulvinar mi. Cras molestie lorem non accumsan
gravida. Sed vulputate, ligula ut tincidunt congue, metus risus luctus lacus,
sed rhoncus ligula turpis non erat. Phasellus est est, *sollicitudin ut*
elementum vel, placerat in orci. Proin molestie posuere dolor sit amet
convallis. Donec id urna vel lacus ultrices pulvinar sit amet id metus. Donec
in venenatis ante. Nam eu rhoncus leo. Quisque posuere, leo vel porttitor
malesuada, nisi urna dignissim justo, vel consectetur purus elit in mauris.
Vestibulum lectus arcu, varius ut ligula quis, viverra gravida sem.

.. warning::

    Pellentesque in enim leo.