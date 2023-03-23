# tiny-surf

https://maybetyler.com/tiny-surf

A tiny way to check the waves. 

### design

WIP whimsical: https://whimsical.com/tiny-surf-RaVBmPqAwErJb2BGGa9rWe

### todo
* [done] fix slug to be url friendly
* [done] some sort of sorting / grouping of spots on server
* [skip] fix main search, need to use virtual list
* try to include spot meta info
* swell charts?
* keyboard shortcuts for nav
* error handling for 404s or missing forecasts

### ideas

* swell map w/ polar area: https://www.chartjs.org/docs/latest/samples/other-charts/polar-area-center-labels.html
* spots w/ info on a map
* more abstract charts
* chrome plugin / home view thing (similar to https://chrome.google.com/webstore/detail/whats-the-weather-extensi/amnflodcllnlhjnfahgpablojaehcpia?hl=en-US)
* ticker of certain spots (tinysurf.com/ticker)
* ios widget
* experiments: tiny widget
* tiny.surf / tinysurf.io

### references

* https://github.com/mhelmetag/surflinef/tree/master/v2
* https://observablehq.com/@justingosses/surfline-api-exploration
* https://services.surfline.com/kbyg/regions/forecasts/conditions?subregionId=58581a836630e24c44878fd4&days=6

### dev

Install deps

```
$ npm install
```

Build and serve app

```
$ npm run app:serve
```

Build server tool (not really a serve, but used for fetching and persisting some surfline data)

```
$ npm run server:watch
```

Deploy

*Note: Site is serve from `main` branch. This assumes all changes are staged and committed before running.*

```
$ ./deploy.sh
```
