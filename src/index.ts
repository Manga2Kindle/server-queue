import {config} from "dotenv";
import {resolve} from "path";
config({path: resolve(__dirname, "../.env")});

import {$log} from "@tsed/common";
import {PlatformExpress} from "@tsed/platform-express";
import Queue from "./modules/queue";
import Workers from "./modules/workers";
import {Server} from "./Server";
import {Worker} from "./models/Worker";
import {registerWorker} from "./modules/workerApiService";

async function bootstrap() {
  try {
    $log.debug("Start server...");
    const platform = await PlatformExpress.bootstrap(Server);
    Queue.Instance; // just to instanciate the queue

    // add workers in the env
    const workers = Workers.Instance;
    const workerURLS = process.env.WORKERS!.split(" ");
    for (let i = 0; i < workerURLS.length; i++) {
      const worker = new Worker(workerURLS[i]);
      workers.add(await registerWorker(worker));
    }

    await platform.listen();
    $log.debug("Server initialized");
  } catch (er) {
    $log.error(er);
  }
}

bootstrap();
