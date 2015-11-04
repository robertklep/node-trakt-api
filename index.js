var assert  = require('assert');
var norma   = require('norma');
var lodash  = require('lodash');
var request = require('request');
var Promise = require('bluebird').Promise;
var logger  = require('winston');

var DEFAULTS = {
  apiUrl   : 'https://api-v2launch.trakt.tv',
  extended : 'min',
  logLevel : 'info',
  poolSize : 5,
  timeout  : 30000
};

var Trakt = module.exports = function Trakt(apiKey, opts) {
  if (! (this instanceof Trakt)) {
    return new Trakt(apiKey, opts);
  }
  assert(apiKey, 'missing API key');

  // Merge options with defaults
  this.opts = lodash.merge({}, DEFAULTS, opts);

  // Create a request instance with the proper defaults.
  this.req = request.defaults({
    pool    : { maxSockets : this.opts.poolSize },
    timeout : this.opts.timeout,
    headers : {
      'trakt-api-key'     : apiKey,
      'trakt-api-version' : '2',
      'content-type'      : 'application/json',
    }
  });

  // Set log level
  logger.level = this.opts.logLevel;
  logger.debug('initialized');
};

Trakt.prototype.request = function() {
  var args = norma('method:s endpoint:s endpointParams:o? qsParams:o? callback:f?', arguments);

  // Additional request parameters
  var params = args.qsParams || {};
  if (! params.extended && this.opts.extended) {
    params.extended = this.opts.extended;
  }

  // Perform API request.
  var url = this.opts.apiUrl + this.expand(args.endpoint, args.endpointParams || {});
  var req = this.req.bind(this.req);
  return new Promise(function(resolve, reject) {
    logger.debug('making API request', { url : url, method : args.method, qs : JSON.stringify(params) });

    req({
      method : args.method,
      url    : url,
      qs     : params,
    }, function(err, message, body) {

      // Reject errors outright.
      if (err) return reject(err);

      // Reject non-200 status codes.
      if (message.statusCode !== 200) {
        err            = new Error('unexpected API response');
        err.statusCode = message.statusCode;
        return reject(err);
      }

      // Parse response.
      try {
        return resolve(JSON.parse(body));
      } catch(e) {
        return reject(e);
      }

    });
  }).nodeify(args.callback);
};

// Dynamically generate API methods.
require('./endpoints.json').forEach(function(endpoint) {
  if (! endpoint.name) return;

  // Compile arguments handler.
  var argspec = norma.compile(lodash.map(endpoint.params, function(flags, param) {
    return lodash.camelCase(param) + ':s|i' + (flags.optional ? '?' : '');
  }).concat('opts:o?', 'callback:f?').join(' '));

  // Create the API method.
  Trakt.prototype[endpoint.name] = function() {
    // Parse arguments. This throws if the method isn't
    // called with the proper (required) arguments.
    var args = argspec(arguments);

    // Collect parameters.
    var params = lodash(endpoint.params).keys().map(function(param) {
      return [ param, args[lodash.camelCase(param)] ];
    }).zipObject().value();

    // Perform the request.
    return this.request(endpoint.method, endpoint.endpoint, params, args.opts, args.callback);
  };
});

// Search methods.
Trakt.prototype.search = Trakt.prototype.searchAll = function() {
  var args   = norma('query:s type:s? year:i? callback:f?', arguments);
  var params = {
    query : args.query,
    type  : args.type,
    year  : args.year,
  };
  return this.request('GET', '/search', {}, params, args.callback);
};

[ 'Show', 'Movie', 'Episode', 'Person' ].forEach(function(type) {
  Trakt.prototype['search' + type] = function() {
    var args = [].slice.call(arguments);
    args.splice(1, 0, type.toLowerCase());
    return this.search.apply(this, args);
  };
});

// Helper methods.
Trakt.prototype.expand = function(template, params) {
  return template.replace(/{(.*?)}/g, function(m, b) { return params[b] || ''; });
};
