var assert  = require('assert');
var lodash  = require('lodash');
var request = require('request');
var nodeify = require('bluebird').nodeify;
var Promise = require('bluebird').Promise;
var logger  = require('winston');

var DEFAULTS = {
  apiUrl        : 'https://api-v2launch.trakt.tv',
  extendedLevel : 'min',
  logLevel      : 'info',
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

Trakt.prototype.request = function(method, endpoint, endpointParams, qsparams, callback) {
  // Argument handling.
  if (lodash.isFunction(qsparams)) {
    callback = qsparams;
    qsparams = {};
  }

  // Additional request parameters
  var params = lodash.isPlainObject(qsparams) ? qsparams : {};
  if (! params.extended && this.opts.extendedLevel) {
    params.extended = this.opts.extendedLevel;
  }

  // Perform API request.
  var url = this.opts.apiUrl + this.expand(endpoint, endpointParams);
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

// API method wrapper.
Trakt.prototype.endpoint = function(endpoint, params, opts, callback) {
  params = params || {};
  // Argument handling.
  if (lodash.isFunction(params)) {
    callback = params;
    params   = {};
  }
  return new Promise(function(resolve, reject) {
    // Check parameters
    var rejected = false;
    lodash.each(endpoint.params, function(flags, param) {
      if (! rejected && flags.required && params[param] === undefined) {
        rejected = true;
        return reject(new Error('missing required parameter "' + param + '"'));
      }
    });
    if (rejected) return;
    // Make the call.
    return resolve(this.request(endpoint.method, endpoint.endpoint, params, opts, callback));
  }.bind(this));
};

// Dynamically generate API methods.
require('./endpoints.json').forEach(function(endpoint) {
  if (! endpoint.name) return;
  Trakt.prototype[endpoint.name] = function() {
    var args = [].slice.call(arguments);
    args.unshift(endpoint);
    return Trakt.prototype.endpoint.apply(this, args);
  };
});

// Search methods.
Trakt.prototype.search = Trakt.prototype.searchAll = function(query, type, callback) {
  if (lodash.isFunction(type)) {
    callback = type;
    type     = null;
  }
  var params = { query : query };
  if (type) params.type = type;
  return this.request('GET', '/search', {}, params, callback);
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

Trakt.prototype.paginate = function(params, opts) {
  params       = params || {};
  opts         = opts   || {};
  params.page  = opts.page  === undefined ?  1 : opts.page;
  params.limit = opts.limit === undefined ? 10 : opts.limit;
  return params;
};

Trakt.prototype.extended = function(params, level) {
  params          = params || {};
  params.extended = level === undefined ? this.opts.extendedLevel : level;
  return params;
};
