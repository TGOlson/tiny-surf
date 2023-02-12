import { cleanTaxonomy, inspectTaxonomy, parseSpots } from "./surfline/parse";
import { earthTaxonomy, additionalTaxonomy, allTaxonomy, parsedSpots, parsedCASpots } from "./storage";
import { fetchEarthTaxonomy, fetchTaxonomy, flattenTaxonomyResponse } from "./surfline/taxonomy";
import { uniqBy } from "ramda";

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
    case '--test': {
      const spots = await parsedCASpots.read();

      // const slugify = ()
      const slugs = spots.map(x => {
        const base = `${x.name} ${x.id.slice(20)}`;
        return base.toLowerCase().replace(/ /g, '-');
      });

      const dupes: string[] = [];
      const slugMap = slugs.reduce((accum: {[key: string]: string}, slug) => {
        if (accum[slug]) {
          dupes.push(slug);
        }

        accum[slug] = slug;

        return accum;
      }, {});

      console.log('dupes', dupes);
      
      // const tx = await fetchEarthTaxonomy({maxDepth: 5});
      console.log(slugs);
      
      return;
    }
    default:
      console.log('Unexpected command:', cmd);
      break;
  }
}

main().catch(err => console.log('Error running main', err));
