var endpoints = require('../endpoints.json');

endpoints.forEach(function(endpoint) {
  if (! endpoint.name) return;
  var params = {};
  if (Object.keys(endpoint.params).length) {
    for (var param in endpoint.params) {
      params[param] = endpoint.params[param].required ? 'REQUIRED' :
                      endpoint.params[param].optional ? 'OPTIONAL' : '...';
    }
  }
  console.log('trakt.%s(%j[, OPTIONS])\n', endpoint.name, params);
});
