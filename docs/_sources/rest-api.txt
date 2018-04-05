========
REST API
========

The REST API is used by the user interface to communicate to your clusters. You may also communicate directly with the REST API, via http://localhost:5000/api

.. contents:: Table of Contents

Connection APIs
---------------
.. .. qrefflask:: application:application
    :endpoints: api.clusters
    :undoc-static:

Connections
~~~~~~~~~~~

.. autoflask:: application:application
    :blueprints: api
    :endpoints: api.clusters
    :undoc-static:
    :order: path

Cluster APIs
------------

Cluster List
~~~~~~~~~~~~

.. autoflask:: application:application
    :blueprints: api
    :endpoints: api.clusters_list
    :undoc-static:
    :order: path

Cluster Health
~~~~~~~~~~~~~~

.. autoflask:: application:application
    :blueprints: api
    :endpoints: api.clusters_health
    :undoc-static:
    :order: path

Cluster Summary
~~~~~~~~~~~~~~~

.. autoflask:: application:application
    :blueprints: api
    :endpoints: api.clusters_summary
    :undoc-static:
    :order: path

Cluster State
~~~~~~~~~~~~~

.. autoflask:: application:application
    :blueprints: api
    :endpoints: api.clusters_state
    :undoc-static:
    :order: path

Node APIs
---------

Note that when calling the Node APIs, you can optionally pass in a comma-delimited list of node_id's as parameters.
Otherwise, information for all nodes in the cluster is returned.

Nodes Summary
~~~~~~~~~~~~~

.. autoflask:: application:application
    :blueprints: api
    :endpoints: api.nodes_summary
    :undoc-static:
    :order: path

Node Info
~~~~~~~~~

.. autoflask:: application:application
    :blueprints: api
    :endpoints: api.nodes_info
    :undoc-static:
    :order: path

Nodes Stats
~~~~~~~~~~~

.. autoflask:: application:application
    :blueprints: api
    :endpoints: api.nodes_stats
    :undoc-static:
    :order: path

Index APIs
----------

Indices
~~~~~~~

.. autoflask:: application:application
    :blueprints: api
    :endpoints: api.indices
    :undoc-static:
    :order: path

Indices Summary
~~~~~~~~~~~~~~~

.. autoflask:: application:application
    :blueprints: api
    :endpoints: api.indices_summary
    :undoc-static:
    :order: path

Index Stats
~~~~~~~~~~~

.. autoflask:: application:application
    :blueprints: api
    :endpoints: api.indices_stats
    :undoc-static:
    :order: path

Index Command
~~~~~~~~~~~~~

.. autoflask:: application:application
    :blueprints: api
    :endpoints: api.index_command
    :undoc-static:
    :order: path

Index Shards
~~~~~~~~~~~~

.. autoflask:: application:application
    :blueprints: api
    :endpoints: api.indices_shards
    :undoc-static:
    :order: path

Index Alias
~~~~~~~~~~~

.. autoflask:: application:application
    :blueprints: api
    :endpoints: api.index_alias
    :undoc-static:
    :order: path

Index Mapping
~~~~~~~~~~~~~

.. autoflask:: application:application
    :blueprints: api
    :endpoints: api.index_mapping
    :undoc-static:
    :order: path

Reindex
~~~~~~~

.. autoflask:: application:application
    :blueprints: api
    :endpoints: api.index_reindex
    :undoc-static:
    :order: path

Diagnostics
-----------

Cluster Diagnostics
~~~~~~~~~~~~~~~~~~~

.. autoflask:: application:application
    :blueprints: api
    :endpoints: api.diagnostics_summary
    :undoc-static:
    :order: path

Snapshots & Repositories
------------------------

Repositories
~~~~~~~~~~~~

.. autoflask:: application:application
    :blueprints: api
    :endpoints: api.snapshot_repositories
    :undoc-static:
    :order: path

Snapshots
~~~~~~~~~

.. autoflask:: application:application
    :blueprints: api
    :endpoints: api.snapshots
    :undoc-static:
    :order: path

HQ APIs
-------

HQ Status
~~~~~~~~~

.. autoflask:: application:application
    :blueprints: api
    :endpoints: api.status
    :undoc-static:
    :order: path

HQ Routes
~~~~~~~~~

.. autoflask:: application:application
    :blueprints: api
    :endpoints: api.routes
    :undoc-static:
    :order: path

ES REST
~~~~~~~

.. autoflask:: application:application
    :blueprints: api
    :endpoints: api.generic_rest
    :undoc-static:
    :order: path
