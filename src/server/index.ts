import path from 'path';
import { uniq, uniqBy } from "ramda";

import { fetchEarthTaxonomy, fetchTaxonomy } from "surfline/taxonomy";
import { RatingForecast, TideForecast, WaveForecast, WindForecast } from 'surfline/forecasts/types';

import { earthTaxonomy, additionalTaxonomy, allTaxonomy, parsedSpots, parsedCASpots, readJSON } from "./storage";

import { parseForecast } from "./surfline/forecast";
import { cleanTaxonomy, inspectTaxonomy, parseSpots, flattenTaxonomyResponse } from './surfline/taxonomy';
import { startServer } from './server';

async function main () {
  const [_, __, cmd] = process.argv;

  switch (cmd) {
    case '--fetch-taxonomy': {
      const tx = await fetchEarthTaxonomy({maxDepth: 6});
      return await earthTaxonomy.write(flattenTaxonomyResponse(tx));
    }
    case '--fetch-additional-taxonomy': {
      const txs = await earthTaxonomy.read();
      const res = inspectTaxonomy(txs);

      const unlinkedIds = res.liesInIds.uniqueUnlinked.vals;
      const txResponses = await Promise.all(unlinkedIds.map(id => fetchTaxonomy({id, maxDepth: 1})));

      const newTxs = uniqBy(x => x._id, txResponses.map(flattenTaxonomyResponse).flat());

      return await additionalTaxonomy.write(newTxs);
    }
    case '--clean-and-merge-taxonomy': {
      const txs = await earthTaxonomy.read();
      const additionalTxs = await additionalTaxonomy.read();
      const allTxs = additionalTxs.concat(txs);
      const cleanedTxs = cleanTaxonomy(allTxs);

      return await allTaxonomy.write(cleanedTxs);
    }
    case '--inspect-taxonomy': {
      const txs = await allTaxonomy.read();
      const res = inspectTaxonomy(txs);
      console.log(res);
      return;
    }
    case '--parse-spots': {
      const txs = await allTaxonomy.read();
      const spots = parseSpots(txs).filter(s => s.locationNamePath.includes('California'));
      
      return await parsedSpots.write(spots);
    }
    case '--parse-ca-spots': {
      const txs = await allTaxonomy.read();
      const spots = parseSpots(txs).filter(s => s.locationNamePath.includes('California'));
      const sortedSpots = spots.sort((a, b) => b.location.lat - a.location.lat);
      
      return await parsedCASpots.write(sortedSpots);
    }
    case '--test-parse-forecast': {
      const waves: WaveForecast = await readJSON(path.resolve(__dirname, '../sample-data/tourmy-waves.json'));
      const wind: WindForecast = await readJSON(path.resolve(__dirname, '../sample-data/tourmy-wind.json'));
      const ratings: RatingForecast = await readJSON(path.resolve(__dirname, '../sample-data/tourmy-ratings.json'));
      const tides: TideForecast = await readJSON(path.resolve(__dirname, '../sample-data/tourmy-tides.json'));

      const forecast = parseForecast(
        '5842041f4e65fad6a77088c4',
        waves,
        ratings,
        wind,
        tides,
      );

      console.log(forecast.data.tides);
      
      return;
    }
    case '--start-server': {
      startServer();
      return;
    }
    case '--test': {
      const spots = await parsedSpots.read();
      const nParts = spots.map(spot => spot.locationNamePath.length);
      const uniqueNParts = uniq(nParts);

      console.log(uniqueNParts);
      
      return;
    }
    default:
      console.log('Unexpected command:', cmd);
      break;
  }
}

main().catch(err => console.log('Error running main', err));
