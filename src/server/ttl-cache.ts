export type TTLCache<T> = {
  get: (id: string) => T | undefined;
  set: (id: string, val: T) => void;
  delete: (id: string) => void;
};

export type TTLCacheConfig = {
  ttl: number, // ms
  flushInterval: number, // ms
  debug?: boolean
};

type InternalCacheItem<T> = {setAt: number, val: T};
type InternalCache<T> = Map<string, InternalCacheItem<T>>;

const log = (debug: boolean, pieces: string[]): void => {
  if (debug) console.log(`[${(new Date()).toISOString()}] [tll-cache]`, ...pieces);
};

export function makeTTLCache<T>({ttl, flushInterval, debug = false}: TTLCacheConfig): TTLCache<T> {
  const cache: InternalCache<T> = new Map();

  const isExpired = (entry: InternalCacheItem<T>): boolean => (Date.now() - entry.setAt) > ttl;

  const get = (id: string) => {
    const entry = cache.get(id);

    if (entry === undefined) {
      log(debug, ['no entry found for id:', id]);
      return undefined;
    }
    
    if (isExpired(entry)) {
      log(debug, ['entry past TTL for id:', id]);
      del(id);
      return undefined;
    }
    
    log(debug, ['entry found for id:', id]);
    return entry.val;
  };
  
  const set = (id: string, val: T) => {
    log(debug, ['setting entry for id:', id]);
    
    cache.set(id, {
      setAt: Date.now(),
      val
    });
  };
  
  const del = (id: string) => {
    log(debug, ['deleting entry for id:', id]);
    cache.delete(id);
  };
  
  const flush = () => {
    log(debug, ['flushing cache']);
    for (const [id, entry] of cache.entries()) {
      if (isExpired(entry)) del(id);
    }
  };

  setInterval(flush, flushInterval);

  return {get, set, delete: del};
}
