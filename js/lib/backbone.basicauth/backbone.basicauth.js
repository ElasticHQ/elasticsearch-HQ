/*!
 * backbone.basicauth.js v0.4.1
 *
 * Adds HTTP Basic Authentication headers,
 * either by reading them from a model property,
 * or by parsing the model/collection.url.
 *
 * Copyright 2013, Tom Spencer (@fiznool), Luis Abreu (@lmjabreu)
 * backbone.basicauth.js may be freely distributed under the MIT license.
 */
;( function (root, factory) {
  // AMD module if available
  if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['underscore', 'backbone'], factory);
    } else if (typeof exports !== "undefined") {
        // CommonJS export
        module.exports = factory(require("underscore"), require("backbone"));
    } else {
        // Browser globals
        root.amdWeb = factory(root._, root.Backbone);
    }
}( this, function (_, Backbone) {

  var btoa = window.btoa;

  /**
   * Returns a base64 encoded "user:pass" string
   * @param  {string} username The http auth username
   * @param  {string} password The http auth password
   * @return {string}          The base64 encoded credentials pair
   */
  var encode = function(credentials) {
    // Use Base64 encoding to create the authentication details
    // If btoa is not available on your target browser there is a polyfill:
    // https://github.com/davidchambers/Base64.js
    // Using unescape and encodeURIComponent to allow for Unicode strings
    // https://developer.mozilla.org/en-US/docs/Web/API/window.btoa#Unicode_Strings
    console.log("ENCODE %j",credentials);
    return btoa(unescape(encodeURIComponent(
      [credentials.username, credentials.password].join(':'))));
  };

  // Add a public method so that anything else can also create the header
  Backbone.BasicAuth = {
    getHeader: function(credentials) {
      console.log("CRED %j",credentials);
      return {
        'Authorization': 'Basic ' + encode(credentials)
      };
    }
  };

  // Store a copy of the original Backbone.sync
  var originalSync = Backbone.sync;

  /**
   * Override Backbone.sync
   *
   * If a token is present, set the Basic Auth header before the sync is performed.
   *
   * @param  {string} method  Contains the backbone operation. e.g.: read, reset, set
   * @param  {object} model   A Backbone model or collection
   * @param  {object} options Options to be passed over to Backbone.sync and jQuery
   * @return {object}         Reference to Backbone.sync for chaining
   */
  Backbone.sync = function (method, model, options) {
    options = options || {};

    // Basic Auth supports two modes: URL-based and function-based.
    var credentials, remoteUrl, remoteUrlParts;

    if(model.credentials) {
      // Try function-based.
      credentials = _.result(model, 'credentials');
    }

    if(credentials == null) {
      // Try URL-based.
      // Handle both string and function urls
      console.log("MODLE %j",model);
      remoteURL = options.url || _.result(model, 'url');
      console.log("SYNC %s",remoteURL);
      // Retrieve the auth credentials from the model url
      remoteUrlParts = remoteURL.match(/(.*)\/\/(.*):(.*)@(.*)/);
      if (remoteUrlParts && remoteUrlParts.length === 5) {
        credentials = {
          username: remoteUrlParts[2],
          password: remoteUrlParts[3]
        };
        options.url=remoteUrlParts[1]+"//"+remoteUrlParts[4];
        console.log("URL %s",options.url);
      }
    }



    // Add the token to the request headers if available
    if (credentials != null) {
      options.headers = options.headers || {};
      var h=Backbone.BasicAuth.getHeader(credentials);
      console.log("HEADER: %j",h);
      _.extend(options.headers, h);
    }

    // Perform the sync
    return originalSync.call(model, method, model, options);
  };

}));
