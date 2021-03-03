import {$log} from "@tsed/common";
import {Worker} from "../models/Worker";

export default class Workers {
  private static _instance: Workers;
  private workers: Worker[] = [];
  private workerIterator = 0;

  private constructor() {
    $log.info("Instanciate worker object");
  }

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }

  /**
   * adds a worker if not exists
   * @param worker
   */
  public add(worker: Worker) {
    if (!this.workers.some((e) => e.path === worker.path)) {
      this.workers.push(worker);
    }
  }

  /**
   * Will add new workers and remove the ones with are no longer in the array
   *
   * @param workerPaths an array of strings with the paths of the workers
   */
  addAll(workerPaths: string[]) {
    const newWorkerList: Worker[] = [];

    for (let i = 0; i < workerPaths.length; i++) {
      const wk = this.workers.find((e) => {
        return e.path === workerPaths[i];
      });

      if (wk !== undefined) {
        newWorkerList.push(wk);
      } else {
        newWorkerList.push(new Worker(workerPaths[i]));
      }
    }

    this.workers = newWorkerList;
  }

  /**
   * @returns next available worker or void if none available
   */
  public get(): Worker | void {
    for (let i = 0; i < this.workers.length; i++) {
      const index = (((this.workerIterator + i) % this.workers.length) + this.workers.length) % this.workers.length;

      if (this.workers[index].free) {
        this.workerIterator = index;
        return this.workers[index];
      }
    }
  }

  /**
   * @returns number number of workers
   */
  public length(): number {
    return this.workers.length;
  }

  /**
   * @returns number of workers available
   */
  public workersAvailable(): number {
    let workersAvailable = 0;

    for (let i = 0; i < this.workers.length; i++) {
      if (this.workers[i].free) {
        workersAvailable++;
      }
    }

    return workersAvailable;
  }

  /**
   *
   * @param worker the worker to update
   * @param status if not set will be used the worker internal one
   */
  public setStatus(worker: Worker, status: boolean | undefined): void;
  /**
   *
   * @param workerPath the worker to update
   * @param status the status to update the worker
   */
  public setStatus(workerPath: string, status: boolean): void;
  setStatus(wk: string | Worker, status: boolean | undefined): void {
    // if it is a Worker
    if (wk instanceof Worker) {
      // what.
    } else {
      wk = new Worker(wk);
    }

    // put the status
    if (status !== undefined) {
      wk.free = status;
    }

    // rewrite the worker in the list
    const wkIndex = this.workers.findIndex((e) => e.path == (wk as Worker).path); // dumbass linter thats a Worker no mather what, it cant be a string
    this.workers[wkIndex] = wk;
  }
}
