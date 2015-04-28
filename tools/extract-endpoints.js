var fs        = require('fs');
var apidoc    = fs.readFileSync('trakt.apib').toString();
var endpoints = apidoc.match(/^##\s(?:.|[\r\n])*?\[GET\]\s*$/gm);

console.log('%j', endpoints.map(function(ep) {
  var endpoint = ep.match(/\[(.*?)\]/)[1];
  var method   = ep.match(/\[([A-Z]+)\]/m)[1];

  // parameter handling
  var regexp = /^\s+\+\s+(.*?)\s+\((.*?)\)/gm;
  var matches, params = {};
  while ((matches = regexp.exec(ep)) !== null) {
    var name = matches[1];
    params[name] = {
      required : matches[2].indexOf('required') !== -1,
      optional : matches[2].indexOf('optional') !== -1,
    };
  }
  return {
    name     : '',
    method   : method,
    endpoint : endpoint,
    params   : params,
  };
}));
