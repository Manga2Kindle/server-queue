import {Controller, Get} from "@tsed/common";
import {Summary} from "@tsed/schema";
import Queue from "../modules/queue";
import Workers from "../modules/workers";
import {config} from "dotenv";
import {resolve} from "path";
import { Worker } from "../models/Worker";

@Controller("/worker")
export class WorkerController {
  @Get("/register")
  @Summary("Register a worker, called when a new worker comes online")
  register() {
    // reload .env and add/remove workers
    config({path: resolve(__dirname, "../.env")});
    Workers.Instance.addAll(process.env.WORKERS!.split(" "));

    // TODO check worker statuses
  }

  @Get("/done")
  @Summary("Called when a worker finish a job")
  done() {
    // TODO we need something to know what worker was it and put it to true again
    Workers.Instance.setStatus(new Worker("a"), true); // need to be edited
    // TODO if we dont know what worker was just ask all
  }
}
