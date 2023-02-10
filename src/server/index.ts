import { inspectTaxonomy, parseSpots } from "./surfline/parse";
import { readRawTaxonomyData, writeRawTaxonomyData } from "./storage";
import { fetchAllTaxonomies } from "./surfline/taxonomy";

async function main () {
  const [_, __, cmd] = process.argv;

  switch (cmd) {
    case '--download-taxonomy': {
      const tx = await fetchAllTaxonomies();
      return await writeRawTaxonomyData(tx);
    }
    case '--inspect-taxonomy': {
      const tx = await readRawTaxonomyData();
      const res = inspectTaxonomy(tx);
      console.log(res);
      return;
    }
    case '--parse-spots': {
      const tx = await readRawTaxonomyData();
      const spots = parseSpots(tx.contains).filter(s => s.locationNamePath.includes('California'));
      console.log(spots);
      return;
    }
    default:
      console.log('Unexpected command:', cmd);
      break;
  }
}

main().catch(err => console.log('Error running main', err));
