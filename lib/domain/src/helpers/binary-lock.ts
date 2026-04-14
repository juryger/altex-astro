// Binary semaphore based on the following article
// https://dev.to/thegravityguy/understanding-semaphores-a-typescript-guide-2blb

interface BinaryLock {
  acquire: () => Promise<void>;
  release: () => void;
  terminate: () => void;
}

function getBinaryLock(): BinaryLock {
  let locked = false;
  const waitQueue: Array<() => void> = [];
  return {
    acquire: async () => {
      if (!locked) {
        locked = true;
        return;
      }
      // the client will be awaited untill release is called by thread which is earlier acquired the lock
      return new Promise<void>((res) => {
        waitQueue.push(res);
      });
    },
    release: () => {
      if (waitQueue.length === 0) {
        locked = false;
        return;
      }
      const next = waitQueue.shift();
      next && next();
    },
    terminate: () => {
      if (waitQueue.length == 0) {
        locked = false;
        return;
      }
      Promise.all(waitQueue.map((x) => x()));
      locked = false;
    },
  };
}

export { type BinaryLock, getBinaryLock };
