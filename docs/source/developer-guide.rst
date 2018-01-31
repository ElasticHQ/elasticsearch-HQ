===============
Developer Guide
===============

Versions
--------

REST Standards
--------------

REST API
--------

.. contents:: Table of Contents

.. .. py:function:: send_message(sender, recipient, message_body, [priority=1])
   Send a message to a recipient
   :param str sender: The person sending the message
   :param str recipient: The recipient of the message
   :param str message_body: The body of the message
   :param priority: The priority of the message, can be a number 1-5
   :type priority: integer or None
   :return: the message id
   :rtype: int
   :raises ValueError: if the message_body exceeds 160 characters
   :raises TypeError: if the message_body is not a basestring

Connections
^^^^^^^^^^^

.. autoflask:: manage:app
    :blueprints: api
    :endpoints: api.clusters
    :undoc-static:
    :order: path

Clusters
^^^^^^^^

.. autoflask:: manage:app
    :blueprints: api
    :endpoints: api.clusters_list, api.clusters_summary, api.clusters_health
    :undoc-static:
    :order: path

.. autoflask:: manage:app
    :blueprints: api
    :endpoints: api.clusters_state
    :undoc-static:
    :order: path

Nodes
^^^^^

.. autoflask:: manage:app
    :blueprints: api
    :endpoints: api.nodes_summary, api.nodes_stats, api.nodes_info
    :undoc-static:
    :order: path

Indices
^^^^^^^

.. autoflask:: manage:app
    :blueprints: api
    :endpoints: api.indices_summary, api.indices_stats, api.index_command, api.indices_shards, api.index_alias, api.index_mapping
    :undoc-static:
    :order: path


Diagnostics
^^^^^^^^^^^

Status
^^^^^^

.. automodule:: elastichq.api.clusters
   :members:


Contributing
------------

Issues/Bugs
-----------
