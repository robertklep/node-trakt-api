## Trakt.tv API v2

Node.js client for the [Trakt.tv API](http://docs.trakt.apiary.io/#).

Work in progress!

### Quick example

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

### Supported API endpoints

```
trakt.show({"id":"REQUIRED"})

trakt.showAliases({"id":"REQUIRED"})

trakt.showTranslations({"id":"REQUIRED","language":"OPTIONAL"})

trakt.showComments({"id":"REQUIRED"})

trakt.showProgressCollection({"id":"REQUIRED"})

trakt.showProgressWatched({"id":"REQUIRED"})

trakt.showPeople({"id":"REQUIRED"})

trakt.showRatings({"id":"REQUIRED"})

trakt.showRelated({"id":"REQUIRED"})

trakt.showStats({"id":"REQUIRED"})

trakt.showWatching({"id":"REQUIRED"})

trakt.showSeasons({"id":"REQUIRED"})

trakt.season({"id":"REQUIRED","season":"REQUIRED"})

trakt.seasonComments({"id":"REQUIRED","season":"REQUIRED"})

trakt.seasonRatings({"id":"REQUIRED","season":"REQUIRED"})

trakt.seasonStats({"id":"REQUIRED","season":"REQUIRED"})

trakt.seasonWatching({"id":"REQUIRED","season":"REQUIRED"})

trakt.episode({"id":"REQUIRED","season":"REQUIRED","episode":"REQUIRED"})

trakt.episodeComments({"id":"REQUIRED","season":"REQUIRED","episode":"REQUIRED"})

trakt.episodeRatings({"id":"REQUIRED","season":"REQUIRED","episode":"REQUIRED"})

trakt.episodeStats({"id":"REQUIRED","season":"REQUIRED","episode":"REQUIRED"})

trakt.episodeWatching({"id":"REQUIRED","season":"REQUIRED","episode":"REQUIRED"})

```
