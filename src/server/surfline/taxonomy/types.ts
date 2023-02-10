export type Location = {
  coordinates : [number, number],
  type : "Point"
};

export type AssociatedLink = {
  href: string,
  key: 'taxonomy' | 'api' | 'www' | 'travel'
};

// All taxomies include these base properties
type BaseTaxonomy = {
  _id: string,
  location: Location,
  name: string,
  type: 'spot' | 'subregion' | 'region' | 'geoname',
  category: 'surfline' | 'geonames',
  depth: number,
  hasSpots: boolean,
  liesIn: string[], // other taxonomy ids
  updatedAt: string,
};

// Type specific taxonomy properties
export type SpotTaxonomy = BaseTaxonomy & {
  type: 'spot',
  category: 'surfline',
  spot: string,
  hasSpots: false,
  liesIn: [string, string]
};

export type SubregionTaxonomy = BaseTaxonomy & {
  type: 'subregion',
  category: 'surfline',
  subregion: string,
  hasSpots: true,
  liesIn: [string, string]
};


export type RegionTaxonomy = BaseTaxonomy & {
  type: 'region',
  category: 'surfline',
  region: string,
  hasSpots: true,
  liesIn: [string]
};

export type GeonameTaxonomy = BaseTaxonomy & {
  type: 'geoname',
  category: 'geonames',
  geonameId: string,
  enumeratedPath: string, // comma seperated string path to this geoname
  liesIn: [string | null] // null if geoname is earth, string in all other cases
  geonames: object, // not well typed, unclear if this is useful
};

export type Taxonomy = SpotTaxonomy | SubregionTaxonomy | RegionTaxonomy | GeonameTaxonomy;

// Top level response includes a few extra fields
export type TaxonomyResponse = Taxonomy & {
  associated: {
    links: [AssociatedLink, AssociatedLink | null, AssociatedLink | null]
  },
  in: Taxonomy[],
  contains: Taxonomy[],
};

// type refinement helpers
export const isSpotTaxonomy = (t: Taxonomy): t is SpotTaxonomy => t.type === 'spot';
export const isSubregionTaxonomy = (t: Taxonomy): t is SubregionTaxonomy => t.type === 'subregion';
export const isRegionTaxonomy = (t: Taxonomy): t is RegionTaxonomy => t.type === 'region';
export const isGeonameTaxonomy = (t: Taxonomy): t is GeonameTaxonomy => t.type === 'geoname';

export const toTaxonomy = (tx: TaxonomyResponse): Taxonomy => tx;
export const flattenTaxonomyResponse = (tx: TaxonomyResponse): Taxonomy[] => tx.contains.concat(tx.in).concat([toTaxonomy(tx)]);
