import {
  getQueryManager,
  fetchReadReplica,
  ReadReplicaManager,
} from "@/lib/cqrs";
import { ReadReplicaTypes } from "@/lib/domain/src";
import type { BootContext } from "@astroscope/boot";
import { warmup } from "@astroscope/boot/warmup";

// const READ_REPLICAS_UPDATE_CHECK_1HR = 3600000;
// const queryManager = getQueryManager();
// const readReplicaManager = ReadReplicaManager.instance();
// let replicaIntervalObj: NodeJS.RefCounted | undefined = undefined;

const readReplicasUpdateMonitor = async () => {
  // const replica = await queryManager.fetch(() =>
  //   fetchReadReplica(ReadReplicaTypes.Catalog),
  // );
  // if (
  //   !replica.ok ||
  //   replica.error !== undefined ||
  //   replica.data === undefined
  // ) {
  //   console.error(
  //     replica.error ??
  //       new Error(
  //         `Failed to obtain read replica of '${ReadReplicaTypes.Catalog}'`,
  //       ),
  //   );
  //   return;
  // }
  // const currentReplica = readReplicaManager.get(ReadReplicaTypes.Catalog);
  // if (replica.data.createdAt > currentReplica.createdAt) {
  //   readReplicaManager.set(ReadReplicaTypes.Catalog, replica.data);
  // }
};

export async function onStartup({ dev, host, port }: BootContext) {
  console.log("⚙️ ~ Astro boot ~ starting up... %o", { host, port, dev });

  const result = await warmup();
  console.log(`⚙️ ~ Astro boot ~ warmed up: %o`, result);

  // await ReadReplicaManager.instance().initReplicas();

  // replicaIntervalObj = setInterval(
  //   readReplicasUpdateMonitor,
  //   READ_REPLICAS_UPDATE_CHECK_1HR,
  // );
}

export async function onShutdown({ dev }: BootContext) {
  console.log("⚙️ ~ Astro boot ~ shutting down...");
  // replicaIntervalObj && replicaIntervalObj.unref();
}
