import { uniq } from "ramda";

export function notNull<T>(x: T | null | undefined): x is T {
  return x !== null && x !== undefined;
}

export function allEqual<T>(xs: T[]): boolean {
  return uniq(xs).length === 1;
}

// Only use if it's already known that the item exists
// eg. if a length check has already been done 
// (typescript doesn't handle that type of type refinement)
export function get<T>(i: number, xs: T[]): T {
  const x = xs[i];

  if (x === undefined) throw new Error('Unexpected access error in `get`');

  return x;
}
