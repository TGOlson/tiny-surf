import { uniq } from "ramda";

export function notNull<T>(x: T | null | undefined): x is T {
  return x !== null && x !== undefined;
}

export function allEqual<T>(xs: T[]): boolean {
  return uniq(xs).length === 1;
}
