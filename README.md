## Trakt.tv API v2

Node.js client for the [Trakt.tv API](http://docs.trakt.apiary.io/#).

Work in progress!

#### Quick example

```
var Trakt = require('trakt-api');
var trakt = Trakt(API_KEY[, OPTIONS]);

// Promises...
trakt.show({ id : 'manhattan' }, { extended : 'full' }).then(function(show) {
  console.log('%j', show);
}).catch(function(err) {
  console.warn('oh noes', err);
});

// ...or regular callbacks
trakt.show({ id : 'manhattan' }, { extended : 'full' }, function(err, show) {
  if (err) return console.warn('oh noes', err);
  console.log('%j', show);
});
```

#### Supported API endpoints

All endpoints are defined in `endpoints.json`. The ones that have a `name` property are currently implemented.
