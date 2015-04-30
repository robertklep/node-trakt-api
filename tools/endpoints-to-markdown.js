var endpoints = require('../endpoints.json');

endpoints.forEach(function(endpoint) {
  if (! endpoint.name) return;
  var params = Object.keys(endpoint.params || {}).map(function(param, i) {
    var arg = (i !== 0 ? ', ' : '') + param.toUpperCase();
    if (endpoint.params[param].optional) {
      arg = '[' + arg + ']';
    }
    return arg;
  }).join('');
  console.log('trakt.%s(%s[, OPTIONS][, CALLBACK])\n', endpoint.name, params);
});
