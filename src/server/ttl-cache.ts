export type TTLCache<T> = {
  get: (id: string) => T | undefined;
  set: (id: string, val: T) => void;
  delete: (id: string) => void;
};

export type TTLCacheConfig = {
  ttlSeconds: number,
  debug?: boolean
};

type InternalCache<T> = Map<string, {setAt: number, val: T}>;

const secondsElapsed = (t: number): number => 
  (Date.now() - t) / 1000;

export function makeTTLCache<T>({ttlSeconds, debug}: TTLCacheConfig): TTLCache<T> {
  const cache: InternalCache<T> = new Map();

  const get = (id: string) => {
    const entry = cache.get(id);

    if (entry === undefined) {
      if (debug) console.log('No entry found for id:', id);
      return undefined;
    }
    
    if (secondsElapsed(entry.setAt) > ttlSeconds) {
      if (debug) console.log('Entry past TTL for id:', id);
      del(id);
      return undefined;
    }
    
    if (debug) console.log('Entry found id:', id);
    return entry.val;
  };
  
  const set = (id: string, val: T) => {
    if (debug) console.log('Setting entry for id:', id);
    
    cache.set(id, {
      setAt: Date.now(),
      val
    });
  };
  
  const del = (id: string) => {
    if (debug) console.log('Deleting entry for id:', id);
    cache.delete(id);
  };

  return {get, set, delete: del};
}
