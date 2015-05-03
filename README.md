## Trakt.tv API v2

Node.js client for the [Trakt.tv API](http://docs.trakt.apiary.io/#).

Work in progress!

### Installation

```
$ npm i trakt-api
```

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

Most API methods are generated from `endpoints.json`, although not all are implemented yet (see below). API methods generally have required and optional arguments. Required arguments are enforced and will cause an error to be thrown if not defined.

Most API methods also accept an optional `OPTIONS` object. There's one valid option for now:

* `extended`: use an [extended information level](http://docs.trakt.apiary.io/#introduction/extended-info)

However, this option doesn't apply to all API methods. Refer to the Trakt API documentation.

##### Promises versus callbacks

If you don't like promises, or just prefer old school callbacks, pass a function as last argument. Otherwise, all methods return a promise. See the example above.

### Methods currently implemented

```javascript
trakt.search(QUERY[, TYPE][, CALLBACK])

trakt.searchAll(QUERY[, CALLBACK])

trakt.searchShow(QUERY[, CALLBACK])

trakt.searchMovie(QUERY[, CALLBACK])

trakt.searchEpisode(QUERY[, CALLBACK])

trakt.searchPerson(QUERY[, CALLBACK])

trakt.show(ID[, OPTIONS][, CALLBACK])

trakt.showAliases(ID[, OPTIONS][, CALLBACK])

trakt.showTranslations(ID[, LANGUAGE][, OPTIONS][, CALLBACK])

trakt.showComments(ID[, OPTIONS][, CALLBACK])

trakt.showProgressCollection(ID[, OPTIONS][, CALLBACK])

trakt.showProgressWatched(ID[, OPTIONS][, CALLBACK])

trakt.showPeople(ID[, OPTIONS][, CALLBACK])

trakt.showRatings(ID[, OPTIONS][, CALLBACK])

trakt.showRelated(ID[, OPTIONS][, CALLBACK])

trakt.showStats(ID[, OPTIONS][, CALLBACK])

trakt.showWatching(ID[, OPTIONS][, CALLBACK])

trakt.showSeasons(ID[, OPTIONS][, CALLBACK])

trakt.season(ID, SEASON[, OPTIONS][, CALLBACK])

trakt.seasonComments(ID, SEASON[, OPTIONS][, CALLBACK])

trakt.seasonRatings(ID, SEASON[, OPTIONS][, CALLBACK])

trakt.seasonStats(ID, SEASON[, OPTIONS][, CALLBACK])

trakt.seasonWatching(ID, SEASON[, OPTIONS][, CALLBACK])

trakt.episode(ID, SEASON, EPISODE[, OPTIONS][, CALLBACK])

trakt.episodeComments(ID, SEASON, EPISODE[, OPTIONS][, CALLBACK])

trakt.episodeRatings(ID, SEASON, EPISODE[, OPTIONS][, CALLBACK])

trakt.episodeStats(ID, SEASON, EPISODE[, OPTIONS][, CALLBACK])

trakt.episodeWatching(ID, SEASON, EPISODE[, OPTIONS][, CALLBACK])
```
