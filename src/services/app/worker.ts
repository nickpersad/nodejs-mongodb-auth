import { isMainThread, parentPort, Worker, workerData } from "worker_threads";

const mail = require("./mail");

// START
(async () => {
  if (isMainThread) {
    // This re-loads the current file inside a Worker instance.
    new Worker(__filename);
  } else {
    const sent = await mail.send(workerData.sendTo);
    parentPort.postMessage(sent);
  }
})();
