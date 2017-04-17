Contributing
============

If you would like to contribute to this project, please start working on tasks and creating pull requests.


Elasticsearch 5.0
=================

Site plugins are [not supported](https://www.elastic.co/blog/running-site-plugins-with-elasticsearch-5-0) in Elasticsearch 5.0 and you have to host ElasticHQ by your self ([nginx example](example/nginx_es_5.conf)).

ElasticHQ
=========

Monitoring, Management, and Querying Web Interface for ElasticSearch instances and clusters.

Benefits:
* Active real-time monitoring of ElasticSearch clusters and nodes.
* Manage Indices, Mappings, Shards, Aliases, and Nodes.
* Query UI for searching one or multiple Indices.
* REST UI, eliminates the need for cURL and cumbersome JSON formats.
* No software to install/download. 100% web browser-based.
* Optimized to work on mobile phones, tablets, and other small screen devices.
* Easy to use and attractive user interface.
* Free (as in Beer)

Getting Started
---------------

There are several ways to use ElasticHQ. The full list and help are available here: http://www.elastichq.org/gettingstarted.html

* **FREE Hosted Version:** http://www.elastichq.org
* **Install as a Plugin:** http://www.elastichq.org/support_plugin.html
* **Download/Install Web Archive:** https://github.com/royrusso/elasticsearch-HQ/zipball/master

Version Compatibility
---------------------

| Elasticsearch Version | ElasticHQ Branch | Latest HQ Version |
| --------------------- | ---------------- | ------------------|
| <=1.7                 | 1.0              | v1.0.0            |
| =2.x                  | 2.0              | v2.0.3            |
| =5.x                  | 5.0              | v5.0.0            |
 
ElasticHQ master branch, always contains the latest releases supporting the latest Elasticsearch. In this case, Master supports 
Elasticsearch 5.x.

Plugin Installation
-------------------

Navigating to your elasticsearch/bin directory and using the appropriate release tag or the master branch for ES 2.x users:


```
./plugin install royrusso/elasticsearch-HQ
```

Or for a specific branch:

```
./plugin install royrusso/elasticsearch-HQ/v1.0.0
```
 
Requirements
------------
* A Web Browser.
* A running instance of ElasticSearch with reachable REST endpoint.

Contributing
------------
You can find helpful build tips for local development tips in the [Development Guide](DEVELOPMENT.md)

Notes + Support
------------
* Google Group can be found here: https://groups.google.com/d/forum/elastichq
* If you need sample index + documents, see here: https://github.com/royrusso/elasticsearch-sample-index
* If you find a bug, **please** create an issue and report it, or fix it and let me know. ;-)
 
License
------------
See included [License File](LICENSE.md).


