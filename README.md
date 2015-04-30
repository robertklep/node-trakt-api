## Trakt.tv API v2

Node.js client for the [Trakt.tv API](http://docs.trakt.apiary.io/#).

Work in progress!

### Quick example

```javascript
var Trakt = require('trakt-api');
var trakt = Trakt(API_KEY[, OPTIONS]);

// Promises...
trakt.show('manhattan', { extended : 'full' }).then(function(show) {
  console.log('%j', show);
}).catch(function(err) {
  console.warn('oh noes', err);
});

// ...or regular callbacks
trakt.show('manhattan', { extended : 'full' }, function(err, show) {
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
logLevel : String   // log level                (default: 'info')
extended : String   // default "extended" level (default: 'min')
    ```

### API methods

All API methods are generated from `endpoints.json`. The endpoints that have a `name` property are the ones that are implemented. An API method may be passed parameters, some required, some optional. Required parameters are enforced and will cause an error to be returned if not defined.

An API method may be passed an optional `OPTIONS` object, which only makes sense for some endpoints. Valid option:

* `extended`: use an [extended information level](http://docs.trakt.apiary.io/#introduction/extended-info)

If successful, the response will be an object holding the raw (but parsed) Trakt API response.

##### Methods currently implemented:

```javascript
trakt.search(QUERY[, TYPE])

trakt.searchAll(QUERY)

trakt.searchShow(QUERY)

trakt.searchMovie(QUERY)

trakt.searchEpisode(QUERY)

trakt.searchPerson(QUERY)

trakt.show(ID[, OPTIONS])

trakt.showAliases(ID[, OPTIONS])

trakt.showTranslations(ID[, LANGUAGE][, OPTIONS])

trakt.showComments(ID[, OPTIONS])

trakt.showProgressCollection(ID[, OPTIONS])

trakt.showProgressWatched(ID[, OPTIONS])

trakt.showPeople(ID[, OPTIONS])

trakt.showRatings(ID[, OPTIONS])

trakt.showRelated(ID[, OPTIONS])

trakt.showStats(ID[, OPTIONS])

trakt.showWatching(ID[, OPTIONS])

trakt.showSeasons(ID[, OPTIONS])

trakt.season(ID, SEASON[, OPTIONS])

trakt.seasonComments(ID, SEASON[, OPTIONS])

trakt.seasonRatings(ID, SEASON[, OPTIONS])

trakt.seasonStats(ID, SEASON[, OPTIONS])

trakt.seasonWatching(ID, SEASON[, OPTIONS])

trakt.episode(ID, SEASON, EPISODE[, OPTIONS])

trakt.episodeComments(ID, SEASON, EPISODE[, OPTIONS])

trakt.episodeRatings(ID, SEASON, EPISODE[, OPTIONS])

trakt.episodeStats(ID, SEASON, EPISODE[, OPTIONS])

trakt.episodeWatching(ID, SEASON, EPISODE[, OPTIONS])
```
