var assert  = require('assert');
var lodash  = require('lodash');
var request = require('request');
var nodeify = require('bluebird').nodeify;
var Promise = require('bluebird').Promise;
var logger  = require('winston');

var DEFAULTS = {
  apiUrl   : 'https://api-v2launch.trakt.tv',
  logLevel : 'info',
};

var Trakt = module.exports = function Trakt(apiKey, opts) {
  if (! (this instanceof Trakt)) {
    return new Trakt(apiKey, opts);
  }
  assert(apiKey, 'missing API key');

  // Merge options with defaults
  this.opts = lodash.merge({}, DEFAULTS, opts);

  // Create a request instance with the proper defaults.
  this.req  = request.defaults({
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

Trakt.prototype.request = function(method, endpoint, endpointParams, _opts, callback) {
  // Argument handling.
  if (lodash.isFunction(_opts)) {
    callback = _opts;
    _opts    = {};
  }

  // Additional request parameters
  var opts     = lodash.isPlainObject(_opts) ? _opts : {};
  var params   = {};
  if (opts.extended) params = extended(params, opts.extended);
  if (opts.paginate) params = paginate(params, opts.paginate);

  // Perform API request.
  var url = this.opts.apiUrl + expand(endpoint, endpointParams);
  var req = this.req.bind(this.req);
  return new Promise(function(resolve, reject) {
    logger.debug('making API request', { url : url, method : method, qs : JSON.stringify(params) });

    req({
      method : method,
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
  }).nodeify(callback);
};

// Create endpoint methods.
Trakt.prototype.endpoint = function(endpoint, params, opts, callback) {
  params = params || {};
  // Argument handling.
  if (lodash.isFunction(params)) {
    callback = params;
    params   = {};
  }
  return new Promise(function(resolve, reject) {
    // Check parameters
    lodash.each(endpoint.params, function(flags, param) {
      if (flags.required && params[param] === undefined) {
        return reject(new Error('missing required parameter "' + param + '"'));
      }
    });
    // Make the call.
    return resolve(this.request(endpoint.method, endpoint.endpoint, params, opts, callback));
  }.bind(this));
};

require('./endpoints.json').forEach(function(endpoint) {
  if (! endpoint.name) return;
  Trakt.prototype[endpoint.name] = function() {
    var args = [].slice.call(arguments);
    args.unshift(endpoint);
    return Trakt.prototype.endpoint.apply(this, args);
  };
});

// Helper functions
var expand = function(template, params) {
  return template.replace(/{(.*?)}/g, function(m, b) {
    return params[b] || '';
  });
};

var paginate = function(params, opts) {
  params       = params || {};
  opts         = opts   || {};
  params.page  = opts.page  === undefined ?  1 : opts.page;
  params.limit = opts.limit === undefined ? 10 : opts.limit;
  return params;
};

var extended = function(params, level) {
  params          = params || {};
  params.extended = level === undefined ? 'min' : level;
  return params;
};
