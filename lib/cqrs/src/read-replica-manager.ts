import type { ReadReplica } from "@/lib/domain";
import {
  CacheKeys,
  EnvironmentNames,
  getCacheInfo,
  regexTrue,
  selectEnvironment,
  ReadReplicaTypes,
  getInitialReplica,
} from "@/lib/domain";
import { getQueryManager } from "./query-manager";
import { fetchReadReplica } from "./queries/read-replica";

interface BaseReadReplicaManager {
  initReplicas: () => Promise<void>;
  getFilePath: (type: ReadReplicaTypes) => string;
  get: (type: ReadReplicaTypes) => ReadReplica;
  set: (type: ReadReplicaTypes, value: ReadReplica) => void;
}

class ReadReplicaManager implements BaseReadReplicaManager {
  private static __instance: ReadReplicaManager;
  private replicas: Map<string, ReadReplica> = new Map();
  private queryManager = getQueryManager();
  private dbReplicasPath: string;
  private withTracing: boolean;

  static instance() {
    if (!ReadReplicaManager.__instance) {
      ReadReplicaManager.__instance = new ReadReplicaManager();
    }
    return ReadReplicaManager.__instance;
  }

  constructor() {
    this.dbReplicasPath = selectEnvironment(
      EnvironmentNames.DB_READ_REPLICAS_PATH,
    );
    this.withTracing = regexTrue.test(
      selectEnvironment(EnvironmentNames.ENABLE_TRACING),
    );
  }

  private checkReplicasInitialized() {
    // In case local storage was not initialised do it, and on netx call it will return value from db
    this.replicas.size === 0 && this.initReplicas();
  }

  async initReplicas(): Promise<void> {
    this.withTracing &&
      console.log("🐾 ~ read-replica-manager ~ obtaining current replicas.");
    this.queryManager
      .fetch(
        () => fetchReadReplica(ReadReplicaTypes.Catalog),
        getCacheInfo(`${CacheKeys.ReadReplica}-${ReadReplicaTypes.Catalog}`),
      )
      .then((replica) => {
        if (!replica.ok || replica.error !== undefined || !replica.data) {
          console.error(
            "🛑 Failed to init Catalog read replicas, see more details below.",
            replica.error,
          );
          return;
        }
        this.replicas.set(ReadReplicaTypes.Catalog, replica.data);
        this.withTracing &&
          console.log(
            "🐾 ~ read-replica-manager ~ Catalog replica is obtained %o",
            replica.data,
          );
      })
      .catch((error) =>
        console.error(
          "🛑 Failed to init Catalog read replicas, see more details below.",
          error,
        ),
      );
  }

  getFilePath(type: ReadReplicaTypes): string {
    this.checkReplicasInitialized();
    return this.replicas.has(type)
      ? `${this.dbReplicasPath}/${this.replicas.get(type)?.fileName}`
      : `${this.dbReplicasPath}/${getInitialReplica(type).fileName}`;
  }

  get(type: ReadReplicaTypes): ReadReplica {
    this.checkReplicasInitialized();
    const replica = this.replicas.get(type) ?? getInitialReplica(type);
    this.withTracing &&
      console.log(
        "🐾 ~ read-replica-manager ~ retrieve current replica of '%s' %o",
        type,
        replica,
      );
    return replica;
  }

  set(type: ReadReplicaTypes, value: ReadReplica) {
    const existingItem = this.replicas.get(type);
    if (
      existingItem !== undefined &&
      existingItem.createdAt >= value.createdAt
    ) {
      this.withTracing &&
        console.log(
          "🐾 ~ read-replica-manager ~ current replica of '%s' is already up-to-date (from '%s'), skip setting the value %o",
          type,
          existingItem.createdAt,
          value,
        );
      return;
    }
    this.replicas.set(type, value);
    this.withTracing &&
      console.log(
        "🐾 ~ read-replica-manager ~ current replica of '%s' is set to new value %o",
        type,
        value,
      );
  }
}

export { ReadReplicaManager };
