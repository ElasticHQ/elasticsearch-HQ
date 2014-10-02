Development Instructions
=========

This application uses NodeJS and Grunt for building its development environment, distribution copy, and (some) dependency management.

Follow the steps below to build the appropriate structure for either local testing or distro. We assume you have Grunt and NodeJS installed.

DEVELOPMENT
---------------

The development version will rewrite the index.html file in the root directory, using the index.html in the tpl directory, to point to un-minified and un-concatenated JS and CSS files. This is done to help in debugging JS errors or real-time modification of JS and CSS files.

To build the development version, simply drop to console and type: **npm install && grunt dev**


DISTRIBUTION
---------------

The distribution will rewrite the index.html file in the root directory, using the index.html in the tpl directory, to point to minified and concatenated JS and CSS files.

To build the distribution, simply drop to console and type: **npm install && grunt dist**

CHANGELOG
--------------

Changelog generation is achieved through the gh-chngelog Node plugin: https://npmjs.org/package/github-changelog

