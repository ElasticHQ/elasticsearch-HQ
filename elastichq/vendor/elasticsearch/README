Python Elasticsearch Client
===========================

Official low-level client for Elasticsearch. Its goal is to provide common
ground for all Elasticsearch-related code in Python; because of this it tries
to be opinion-free and very extendable.

For a more high level client library with more limited scope, have a look at
`elasticsearch-dsl`_ - a more pythonic library sitting on top of
``elasticsearch-py``.

It provides a more convenient and idiomatic way to write and manipulate
`queries`_. It stays close to the Elasticsearch JSON DSL, mirroring its
terminology and structure while exposing the whole range of the DSL from Python
either directly using defined classes or a queryset-like expressions.

It also provides an optional `persistence layer`_ for working with documents as
Python objects in an ORM-like fashion: defining mappings, retrieving and saving
documents, wrapping the document data in user-defined classes.

.. _elasticsearch-dsl: https://elasticsearch-dsl.readthedocs.io/
.. _queries: https://elasticsearch-dsl.readthedocs.io/en/latest/search_dsl.html
.. _persistence layer: https://elasticsearch-dsl.readthedocs.io/en/latest/persistence.html#doctype

Compatibility
-------------

The library is compatible with all Elasticsearch versions since ``0.90.x`` but you
**have to use a matching major version**:

For **Elasticsearch 6.0** and later, use the major version 6 (``6.x.y``) of the
library.

For **Elasticsearch 5.0** and later, use the major version 5 (``5.x.y``) of the
library.

For **Elasticsearch 2.0** and later, use the major version 2 (``2.x.y``) of the
library, and so on.

The recommended way to set your requirements in your `setup.py` or
`requirements.txt` is::

    # Elasticsearch 6.x
    elasticsearch>=6.0.0,<7.0.0

    # Elasticsearch 5.x
    elasticsearch>=5.0.0,<6.0.0

    # Elasticsearch 2.x
    elasticsearch>=2.0.0,<3.0.0

If you have a need to have multiple versions installed at the same time older
versions are also released as ``elasticsearch2`` and ``elasticsearch5``.

Installation
------------

Install the ``elasticsearch`` package with `pip
<https://pypi.python.org/pypi/elasticsearch>`_::

    pip install elasticsearch


Example use
-----------

Simple use-case::

    >>> from datetime import datetime
    >>> from elasticsearch import Elasticsearch

    # by default we connect to localhost:9200
    >>> es = Elasticsearch()

    # create an index in elasticsearch, ignore status code 400 (index already exists)
    >>> es.indices.create(index='my-index', ignore=400)
    {u'acknowledged': True}

    # datetimes will be serialized
    >>> es.index(index="my-index", doc_type="test-type", id=42, body={"any": "data", "timestamp": datetime.now()})
    {u'_id': u'42', u'_index': u'my-index', u'_type': u'test-type', u'_version': 1, u'ok': True}

    # but not deserialized
    >>> es.get(index="my-index", doc_type="test-type", id=42)['_source']
    {u'any': u'data', u'timestamp': u'2013-05-12T19:45:31.804229'}

`Full documentation`_.

.. _Full documentation: https://elasticsearch-py.readthedocs.io/

Elastic Cloud (and SSL) use-case::

    >>> from elasticsearch import Elasticsearch
    >>> es = Elasticsearch("https://elasticsearch.url:port", http_auth=('elastic','yourpassword'))
    >>> es.info()

Using SSL Context with a self-signed cert use-case::

    >>> from elasticsearch import Elasticsearch
    >>> from elasticsearch.connection import create_ssl_context

    >>> context = create_ssl_context(cafile="path/to/cafile.pem")
    >>> es = Elasticsearch("https://elasticsearch.url:port", ssl_context=context, http_auth=('elastic','yourpassword'))
    >>> es.info()



Features
--------

The client's features include:

 * translating basic Python data types to and from json (datetimes are not
   decoded for performance reasons)
 * configurable automatic discovery of cluster nodes
 * persistent connections
 * load balancing (with pluggable selection strategy) across all available nodes
 * failed connection penalization (time based - failed connections won't be
   retried until a timeout is reached)
 * support for ssl and http authentication
 * thread safety
 * pluggable architecture


License
-------

Copyright 2017 Elasticsearch

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

Build status
------------

.. image:: https://secure.travis-ci.org/elastic/elasticsearch-py.png
   :target: https://travis-ci.org/elastic/elasticsearch-py
