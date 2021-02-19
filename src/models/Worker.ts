import {Property} from "@tsed/schema";

export class Worker {
  constructor(path: string) {
    this.path = path;
    this.free = false;
  }

  @Property()
  public path: string;

  @Property()
  public free: boolean;
}
