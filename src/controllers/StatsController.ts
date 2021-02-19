import {Controller, Get} from "@tsed/common";
import {Summary} from "@tsed/schema";
import Queue from "../modules/queue";
import Workers from "../modules/workers";

@Controller("/")
export class StatsController {
  @Get("/")
  @Summary("Returns some stats")
  getStats() {
    return {
      Jobs: {
        Enqueued: Queue.Instance.length(),
        Done: Queue.Instance.jobsDone()
        // TODO: add average job time
      },
      Workers: {
        Available: Workers.Instance.workersAvailable(),
        Total: Workers.Instance.length()
      }
    };
  }
}
