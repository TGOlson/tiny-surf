export type Spot = {
  id: string,
  name: string
  location: {
    lat: number,
    long: number,
  }
  // keeping this really simple for now
  // this is a path of locations for a spot:
  // eg. ["Earth", "North America", "California", ...]
  // 
  // TODO: works for v0 test but probably needs to be split into a seperate data model at some points
  // eg. for search through regions or sorting
  locationNamePath: string[],
};
