==============
User Guide
==============

.. contents:: Table of Contents
    :depth: 1
    :local:

Initial Login
-------------

ElasticHQ is accessible, in default configuration under http://localhost:5000

.. figure::  /_static/img/login.png
    :width: 600px
    :align: center

The input field takes a url in the form of: ``http://DOMAIN:PORT``

* ``http`` or ``https`` are accepted schemes
* For Basic Auth, use the format: ``http://USERNAME:PASSWORD@DOMAIN:PORT``

The Cluster List
----------------

Connecting to other ES Clusters
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Removing Clusters
~~~~~~~~~~~~~~~~~


Main Dashboard
--------------


Nodes Stats
-----------

Indices
-------

Running Diagnostics
-------------------

Reference
---------

.. _xpack integration:

X-Pack Integration
~~~~~~~~~~~~~~~~~~

X-Pack is configured with authentication. To connect, you must pass along the username and password in the connection URL
using the format ``http://USERNAME:PASSWORD@DOMAIN:PORT``

ElasticHQ will store the username and password in the database, so future connectivity is not an issue.

.. warning:: We do realize that the username and passwords are stored plain text in the ElasticHQ DB, but this is a necessary evil that allows for easy reconnection.

