import { inspectTaxonomy, parseSpots } from "./surfline/parse";
import { readRawExtraTaxonomyData, readRawTaxonomyData, writeRawExtraTaxonomyData, writeRawTaxonomyData } from "./storage";
import { fetchAllTaxonomies, fetchTaxonomy, flattenTaxonomyResponse } from "./surfline/taxonomy";

async function main () {
  const [_, __, cmd] = process.argv;

  switch (cmd) {
    case '--fetch-taxonomy': {
      const tx = await fetchAllTaxonomies();
      return await writeRawTaxonomyData(tx);
    }
    case '--inspect-taxonomy': {
      const tx = await readRawTaxonomyData();
      const res = inspectTaxonomy(flattenTaxonomyResponse(tx));
      console.log(res, res.liesInIds.uniqueUnlinked.vals);
      return;
    }
    case '--inspect-taxonomy-with-extra': {
      const tx = await readRawTaxonomyData();
      const txs = await readRawExtraTaxonomyData();
      const flattened = txs.map(flattenTaxonomyResponse).flat().concat(flattenTaxonomyResponse(tx));
      const res = inspectTaxonomy(flattened);
      console.log(res, res.liesInIds.uniqueUnlinked.vals);
      return;
    }
    case '--fetch-unlinked-taxonomy': {
      const tx = await readRawTaxonomyData();
      const res = inspectTaxonomy(flattenTaxonomyResponse(tx));
      const unlinkedIds = res.liesInIds.uniqueUnlinked.vals;
      const txs = await Promise.all(unlinkedIds.map(id => fetchTaxonomy({id, maxDepth: 1})));
      return await writeRawExtraTaxonomyData(txs);
    }
    case '--parse-spots': {
      const tx = await readRawTaxonomyData();
      const txs = await readRawExtraTaxonomyData();
      const flattened = txs.map(flattenTaxonomyResponse).flat().concat(flattenTaxonomyResponse(tx));

      const spots = parseSpots(flattened).filter(s => s.locationNamePath.includes('California'));
      
      console.log(spots);
      return;
    }
    default:
      console.log('Unexpected command:', cmd);
      break;
  }
}

main().catch(err => console.log('Error running main', err));
