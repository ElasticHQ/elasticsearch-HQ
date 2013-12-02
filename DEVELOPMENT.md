Development Tips for ElasticHQ
=========

This application uses NodeJS and Grunt for building its development environment, distribution copy, and (some) dependency management.

Follow the steps below to build the appropriate structure for either local testing or distro. We assume you have Grunt and NodeJS installed.

DEVELOPMENT
===========

The development version will rewrite the index.html file in the root directory, using the index.html in the tpl directory, to point to un-minified and un-concatenated JS and CSS files.

To build the development version, simply drop to console and type: **grunt dev**


DISTRIBUTION
===========

The distribution will rewrite the index.html file in the root directory, using the index.html in the tpl directory, to point to minified and concatenated JS and CSS files.

To build the distribution, simply drop to console and type: **grunt dist**