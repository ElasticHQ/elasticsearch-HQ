ElasticHQ - Version 3.0 - In Development
=========

This version is considered experimental until a formal v3.0GA release. Until then, please use the [master branch](https://github.com/ElasticHQ/elasticsearch-HQ/tree/master) of this repository for production systems.

For the formal announcement of this version, [see here](https://groups.google.com/forum/#!topic/elastichq/rZOBFNePRKg).

Requirements
------------

* Python 3.4+


Installation
------------

1. Download or clone the repository. 
2. Open terminal and point to root of repository. Type: ``pip install -r requirements.txt``
3. Run server with: `` python application.py ``. Alternatively: ``./manage.py runserver``
4. Access HQ with: `` http://localhost:5000 ``
5. All API endpoints are available through `` http://localhost:5000/api ``. Accessing `` http://localhost:5000/api/status `` with a browser (or GET request) will print current version information and general status of HQ. 

During development, the UI has not been built in to the distribution, so you have to start the UI separately:

1. ``npm install``
2. ``npm start``
3. Point your browser to ``http://localhost:8080``

Configuration
-------------

TODO

Notes + Support
---------------
* Google Group can be found here: https://groups.google.com/d/forum/elastichq
* If you need sample index + documents, see here: https://github.com/royrusso/elasticsearch-sample-index
* If you find a bug, **please** create an issue and report it, or fix it and let me know. ;-)
 
License
------------
See included [License File](LICENSE.md).


