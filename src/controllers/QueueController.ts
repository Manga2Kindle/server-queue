import {Controller, Delete, Get, PathParams, Put} from "@tsed/common";
import {Summary} from "@tsed/schema";
import Queue from "../modules/queue";
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
  }

  @Delete("/:id")
  @Summary("Removes the id from the queue")
  delete(
    @PathParams("id")
    id: number
  ) {}
}
