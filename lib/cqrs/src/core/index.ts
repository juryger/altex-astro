import type {
  DatabaseSchema,
  DatabaseTransaction,
  DatabaseType,
} from "@/lib/dal";
import type {
  CacheInfo,
  ReadReplica,
  ReadReplicaTypes,
  Result,
} from "@/lib/domain";

interface CommandManager {
  mutate: <T = any>(commandFn: () => Promise<T>) => Promise<Result<T>>;
  mutateTransactional: <T = any>(
    type: DatabaseType,
    commands: Array<
      (tx: DatabaseTransaction<DatabaseSchema>, prevResult?: any) => any
    >,
  ) => Result<T>;
}

type CacheResult<T = any> = {
  value?: T;
  error?: Error;
  set?: (value: T, staleTimeMs: number) => void;
  clearSetLock?: () => void;
};

interface BaseCacheManager {
  contains: (key: string) => boolean;
  get: <T = any>(key: string) => Promise<CacheResult<T>>;
  getSize: () => number;
  getSizeLimit: () => number;
  containsInvalid: () => boolean;
  revalidate: () => boolean;
  reset: () => void;
  terminate: () => void;
}

interface QueryManager {
  fetch: <T = any>(
    queryFn: () => Promise<T>,
    cacheInfo?: CacheInfo,
  ) => Promise<Result<T>>;
}

interface BaseReadReplicaManager {
  initReplicas: () => Promise<void>;
  getFilePath: (type: ReadReplicaTypes) => string;
  get: (type: ReadReplicaTypes) => ReadReplica;
  set: (type: ReadReplicaTypes, value: ReadReplica) => void;
}

export type {
  CommandManager,
  BaseCacheManager,
  CacheResult,
  QueryManager,
  BaseReadReplicaManager,
};
