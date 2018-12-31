# ElasticHQ

Simplified Monitoring and Management for ElasticSearch clusters.

[![gitHub stars](https://img.shields.io/github/stars/ElasticHQ/elasticsearch-HQ.svg)](https://github.com/ElasticHQ/elasticsearch-HQ)
[![docker pulls](https://img.shields.io/docker/pulls/elastichq/elasticsearch-hq.svg)](https://hub.docker.com/r/elastichq/elasticsearch-hq 'DockerHub')
[![latest](https://img.shields.io/github/release/ElasticHQ/elasticsearch-HQ.svg)](https://github.com/ElasticHQ/elasticsearch-HQ)
[![gitHub issues](https://img.shields.io/github/issues/ElasticHQ/elasticsearch-HQ.svg)](https://github.com/ElasticHQ/elasticsearch-HQ)
![python](https://img.shields.io/badge/python-v3.4%20%2F%20v3.6-blue.svg)
[![license](https://img.shields.io/badge/license-ASL-blue.svg)](https://opensource.org/licenses/ASL)


![alt text](https://raw.githubusercontent.com/ElasticHQ/elasticsearch-HQ/master/main_dashboard.png)

  
## Key Features

* Works with 2.x, 5.x, 6.x and current versions of Elasticsearch. 
* Monitor **many** clusters at once.
* Monitor Nodes, Indices, Shards, and general cluster metrics.
* Create and maintain Elasticsearch Indices.
* One-Click access to ES API and cat API endpoints.
* Easy-to-Use Querying capabilities.
* Copy mappings and reindex Indices.
* Real-time monitoring charts of important metrics.
* Diagnostics check-up helps alert to specific nodes having issues.
* Active project used by Fortune 100 companies around the world.
* Free and (Real) Open Source. ;-)

## Installation

### Requirements

* Python 3.4+

### Instructions

For **full** installation and configuration instructions, see [Getting Started](http://docs.elastichq.org/installation.html)

1. Download or clone the repository. 
2. Open terminal and point to root of repository. Type: ``pip install -r requirements.txt``
3. Run server with: `` python3 application.py ``. Alternatively: ``./manage.py runserver``
4. Access HQ with: `` http://localhost:5000 ``

For further installation and configuration help, please read the docs: [ElasticHQ Documentation](http://docs.elastichq.org)

## Docker Installation

We are hosted on Dockerhub: [ElasticHQ on Dockerhub](https://hub.docker.com/r/elastichq/elasticsearch-hq/)  

1. ``docker run -p 5000:5000 elastichq/elasticsearch-hq``
2. Access HQ with: `` http://localhost:5000 ``

For further instructions, please see relevant documentation: [Docker Images](http://docs.elastichq.org/installation.html#docker-images).

## Useful Links

* [Documentation](http://docs.elastichq.org)
* [Official Website](http://www.elastichq.org)
* [Docker Images](https://hub.docker.com/r/elastichq/elasticsearch-hq/)
* [Google Group](https://groups.google.com/d/forum/elastichq)



