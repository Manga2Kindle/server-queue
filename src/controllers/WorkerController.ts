import {$log, BodyParams, Controller, Get, Post} from "@tsed/common";
import {Returns, Summary} from "@tsed/schema";
import Queue from "../modules/queue";
import Workers from "../modules/workers";
import {config} from "dotenv";
import {resolve} from "path";
import {Worker} from "../models/Worker";
import {BadRequest} from "@tsed/exceptions";
import {convertChapter, registerWorker} from "../modules/workerApiService";

@Controller("/worker")
export class WorkerController {
  @Post("/register")
  @Summary("Register a worker, called when a new worker comes online")
  @Returns(200)
  @Returns(400)
  async register(
    @BodyParams("worker")
    worker: string
  ): Promise<void> {
    if (worker == undefined || !this.validURL(worker)) {
      throw new BadRequest("Whatever 'worker' is, is not an URL right now");
    }

    // reload .env and add/remove workers
    const workerURLS = process.env.WORKERS!.split(" ");
    const workers: Worker[] = [];
    config({path: resolve(__dirname, "../.env")});

    for (let i = 0; i < workerURLS.length; i++) {
      workers.push(await registerWorker(new Worker(workerURLS[i])));
    }
    Workers.Instance.addAll(workerURLS);

    const wk = Workers.Instance.get();
    if (wk instanceof Worker) {
      const chapter = Queue.Instance.shift();
      if (chapter != undefined) {
        convertChapter(wk, chapter);
      }
    }
  }

  @Post("/done")
  @Summary("Called when a worker finish a job")
  done(
    @BodyParams("worker")
    worker: string
  ) {
    if (!Workers.Instance.setStatus(new Worker(worker), true)) {
      // worker unknown
      $log.warn("Worker unknown: " + worker);
    }

    const wk = Workers.Instance.get();
    if (wk instanceof Worker) {
      const chapter = Queue.Instance.shift();
      if (chapter != undefined) {
        convertChapter(wk, chapter);
      }
    }
  }

  private validURL(str: string) {
    const pattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
      "i"
    ); // fragment locator
    return !!pattern.test(str);
  }
}
