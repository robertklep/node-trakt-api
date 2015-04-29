## Trakt.tv API v2

Node.js client for the [Trakt.tv API](http://docs.trakt.apiary.io/#).

Work in progress!

### Quick example

```javascript
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

### Constructor

```javascript
var trakt = Trakt(API_KEY : String [, OPTIONS : Object]);
```

* `API_KEY` is the _Client ID_ value listed on your [application's page](https://trakt.tv/oauth/applications). You need to [create a new application](https://trakt.tv/oauth/applications/new) before you can use this API.
* `OPTIONS` is an optional object that may contain the following properties:

    ```
logLevel      : String   // log level                (default: 'info')
extendedLevel : String   // default "extended level" (default: 'min')
    ```

### API methods

All API methods are generated from `endpoints.json`. The endpoints that have a `name` property are the ones that are implemented. An API method may be passed parameters, some required, some optional. Required parameters are enforced and will cause an error to be returned if not defined.

An API method may be passed an optional `OPTIONS` object, which only makes sense for some endpoints. Valid options:

* `extended`: use an [extended information level](http://docs.trakt.apiary.io/#introduction/extended-info)
* `paginate`: an object containing `page` and `limit` properties to [paginate results](http://docs.trakt.apiary.io/#introduction/pagination)

If successful, the response will be an object holding the raw (but parsed) Trakt API response.

##### Methods currently implemented:

```javascript
trakt.show({"id":"REQUIRED"}[, OPTIONS])

trakt.showAliases({"id":"REQUIRED"}[, OPTIONS])

trakt.showTranslations({"id":"REQUIRED","language":"OPTIONAL"}[, OPTIONS])

trakt.showComments({"id":"REQUIRED"}[, OPTIONS])

trakt.showProgressCollection({"id":"REQUIRED"}[, OPTIONS])

trakt.showProgressWatched({"id":"REQUIRED"}[, OPTIONS])

trakt.showPeople({"id":"REQUIRED"}[, OPTIONS])

trakt.showRatings({"id":"REQUIRED"}[, OPTIONS])

trakt.showRelated({"id":"REQUIRED"}[, OPTIONS])

trakt.showStats({"id":"REQUIRED"}[, OPTIONS])

trakt.showWatching({"id":"REQUIRED"}[, OPTIONS])

trakt.showSeasons({"id":"REQUIRED"}[, OPTIONS])

trakt.season({"id":"REQUIRED","season":"REQUIRED"}[, OPTIONS])

trakt.seasonComments({"id":"REQUIRED","season":"REQUIRED"}[, OPTIONS])

trakt.seasonRatings({"id":"REQUIRED","season":"REQUIRED"}[, OPTIONS])

trakt.seasonStats({"id":"REQUIRED","season":"REQUIRED"}[, OPTIONS])

trakt.seasonWatching({"id":"REQUIRED","season":"REQUIRED"}[, OPTIONS])

trakt.episode({"id":"REQUIRED","season":"REQUIRED","episode":"REQUIRED"}[, OPTIONS])

trakt.episodeComments({"id":"REQUIRED","season":"REQUIRED","episode":"REQUIRED"}[, OPTIONS])

trakt.episodeRatings({"id":"REQUIRED","season":"REQUIRED","episode":"REQUIRED"}[, OPTIONS])

trakt.episodeStats({"id":"REQUIRED","season":"REQUIRED","episode":"REQUIRED"}[, OPTIONS])

trakt.episodeWatching({"id":"REQUIRED","season":"REQUIRED","episode":"REQUIRED"}[, OPTIONS])
```
