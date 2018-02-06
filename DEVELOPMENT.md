# Development Instructions

See README for this version until a GA release.


## DEVELOPMENT

1. Use Python 3.4+
2. We advise that you create a virtual environment for this project.

## TESTING

1. ``/tests/scripts`` contains ``start_clusters.sh`` which will start up 3 ES clusters on ports 9200, 8200, 7200. These are versions 2.x, 5.x, and 6.x respectively.
2. Edit ``start_clusters.sh`` to point to your local ES binaries.
3. Source the virtual environment:
```sh
source ../environments/elastichq/bin/activate
```
4. To run tests:
```sh
elastichq/run_tests
```

### Notes

* Coverage report will be appear under ``/tests/cover``.
* All tests will fail without those 3 clusters running. They are the 3 major versions that HQ currently supports. 
* The scripts under ``/tests/scripts`` allow for starting, stopping, and listing all clusters. You will need to edit those for the tests to run.

## Building Documentation

``./sphinx-build -b html /path/to/docs/source /path/to/docs``

## DISTRIBUTION


To build the final distribution that will have the UI and API accessible from port 5000, run `npm run-script build`.

This will create an `index.html` that the Flask server will serve, under `/elastichq/templates` and static file bundles under `/elastichq/static`.

Once the distribution is built, you can start the server with `python application.py` and view the application at http://localhost:5000

## CHANGELOG

...

