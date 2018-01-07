ElasticHQ - Version 3.0 - In Development
=========

This version is considered experimental until a formal v3.0GA release. Until then, please see instructions on the [master branch](https://github.com/ElasticHQ/elasticsearch-HQ/tree/master) of this repository.

For the formal announcement of this version, [see here](https://groups.google.com/forum/#!topic/elastichq/rZOBFNePRKg).

Requirements
------------

* Python 3.4+


Installation
------------

1. Download or clone the repository. Currently the develop_v3_0_0 branch is what this README is tied to.
2. Open terminal and point to root of repository. With Python 3.4+ installed, type: ``pip install -r requirements.txt``
3. Once all requirements are installed, Run server with: `` python application.py ``
4. Browser access is achieved through `` http://localhost:5000 ``
5. All API endpoints are available through `` http://localhost:500/api ``. Accessing `` http://localhost:5000/api/status `` with a browser (or GET request) will print current version information and general status of HQ. 

Notes + Support
------------
* Google Group can be found here: https://groups.google.com/d/forum/elastichq
* If you need sample index + documents, see here: https://github.com/royrusso/elasticsearch-sample-index
* If you find a bug, **please** create an issue and report it, or fix it and let me know. ;-)
 
License
------------
See included [License File](LICENSE.md).


