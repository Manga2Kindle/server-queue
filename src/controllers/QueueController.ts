import {Controller, Delete, Get, PathParams, Put} from "@tsed/common";
import {Summary} from "@tsed/schema";
import { Worker } from "../models/Worker";
import Queue from "../modules/queue";
import {convertChapter} from "../modules/workerApiService";
import Workers from "../modules/workers";

@Controller("/")
export class QueueController {
  @Put("/:id")
  @Summary("Adds the id to the queue")
  put(
    @PathParams("id")
    id: number
  ) {
    Queue.Instance.push(id);

    if (Workers.Instance.workersAvailable() > 0 || Queue.Instance.length() > 0) {
      const worker = Workers.Instance.get();
      if (worker instanceof Worker) {
        if(convertChapter(worker, Queue.Instance.shift()!)) {
          Workers.Instance.setStatus(worker, false);
        }
      }
    }
  }

  @Delete("/:id")
  @Summary("Removes the id from the queue")
  delete(
    @PathParams("id")
    id: number
  ) {
    Queue.Instance.remove(id);
  }
}
