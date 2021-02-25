import {BodyParams, Controller, Get, Post} from "@tsed/common";
import {Returns, Summary} from "@tsed/schema";
import Queue from "../modules/queue";
import Workers from "../modules/workers";
import {config} from "dotenv";
import {resolve} from "path";
import {Worker} from "../models/Worker";
import {BadRequest} from "@tsed/exceptions";

@Controller("/worker")
export class WorkerController {
  @Post("/register")
  @Summary("Register a worker, called when a new worker comes online")
  @Returns(200)
  @Returns(400)
  register(
    @BodyParams("worker")
    worker: string
  ): void {
    if (worker == undefined || !this.validURL(worker)) {
      throw new BadRequest("Whatever 'worker' is, is not an URL right now");
    }

    // reload .env and add/remove workers
    config({path: resolve(__dirname, "../.env")});
    Workers.Instance.addAll(process.env.WORKERS!.split(" "));

    // TODO check worker statuses
  }

  @Post("/done")
  @Summary("Called when a worker finish a job")
  done(
    @BodyParams("worker")
    worker: string
  ) {
    // TODO we need something to know what worker was it and put it to true again
    Workers.Instance.setStatus(new Worker("a"), true); // need to be edited
    // TODO if we dont know what worker was just ask all
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
