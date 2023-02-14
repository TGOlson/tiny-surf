export type Spot = {
  id: string, // corresponds to surfline spot id
  taxonomyId: string, // corresponds to surfline taxonomy id
  name: string,
  slug: string,
  location: {
    lat: number,
    long: number,
  },
  geonameId: string, // id of closest geoname, not necessarily the closest taxonomy type
  
  // keeping this really simple for now
  // this is a path of locations for a spot:
  // eg. ["Earth", "North America", "California", ...]
  // 
  // TODO: works for v0 test but probably needs to be split into a seperate data model at some points
  // eg. for search through regions or sorting
  locationNamePath: string[],
};

export type Forecast = {
  spotId: string
};
