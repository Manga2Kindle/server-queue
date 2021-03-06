import {$log} from "@tsed/common";

export default class Queue {
  private static _instance: Queue;
  private queue: number[] = [];
  private jobs = 0;

  private constructor() {
    $log.info("Instanciate queue");
  }

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  public push(n: number) {
    this.queue.push(n);
  }

  public remove(n: number) {
    const index = this.queue.indexOf(n);
    if (index > -1) {
      this.queue.splice(index, 1);
    }
  }

  public shift(): number | undefined {
    this.jobs++;
    return this.queue.shift();
  }

  public length(): number {
    return this.queue.length;
  }

  public jobsDone(): number {
    return this.jobs;
  }
}
