type Location = {
  coordinates : [number, number],
  type : "Point"
};

// properties that all taxomies include
type SurflineBaseTaxonomy = {
  _id: string,
  associated: object, // unused, not well typed
  contains: SurflineTaxonomy[],
  location: Location,
  name: string,
  type: 'spot' | 'subregion' | 'region' | 'geoname',
  category: 'surfline' | 'geonames',
  depth: number,
  hasSpots: boolean,
  liesIn: string[], // other taxonomy ids
  updatedAt: string,
};

type SurflineSpotTaxonomy = {
  type: 'spot',
  category: 'surfline',
  spot: string,
  hasSpots: false,
};

type SurflineSubregionTaxonomy = {
  type: 'subregion',
  category: 'surfline',
  subregion: string,
  hasSpots: true,
};


type SurflineRegionTaxonomy = {
  type: 'region',
  category: 'surfline',
  region: string,
  hasSpots: true,
};

type SurflineGeonameTaxonomy = {
  type: 'geoname',
  category: 'geonames',
  geonameId: string,
  spot: string,
  hasSpots: true,
  enumeratedPath: string,
  geonames: object, // unused, not well typed
};


export type SurflineTaxonomy 
  = (SurflineBaseTaxonomy & SurflineSpotTaxonomy)
  | (SurflineBaseTaxonomy & SurflineSubregionTaxonomy)
  | (SurflineBaseTaxonomy & SurflineRegionTaxonomy)
  | (SurflineBaseTaxonomy & SurflineGeonameTaxonomy);
