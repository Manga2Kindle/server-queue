import { $log } from "@tsed/common";
import axios from "axios";
import {Worker} from "../models/Worker";

export async function registerWorker(worker: Worker): Promise<Worker> {
  const axiosInstance = axios.create({
    baseURL: worker.path,
    timeout: 1000
  });

  try {
    $log.debug("registerWorker:" + worker.path);
    const res = await axiosInstance.get("/register");

    if (res.status != 200) {
      worker.free = false;
      return worker;
    }

    if (res.data.worker != worker.path) {
      worker.free = false;
      return worker;
    } else {
      worker.free = res.data.free;
      return worker;
    }
  } catch (error) {
    worker.free = false;
    return worker;
  }
}

export async function checkStatus(worker: Worker): Promise<Worker> {
  const axiosInstance = axios.create({
    baseURL: worker.path,
    timeout: 1000
  });

  $log.debug("checkStatus:" + worker.path);
  const res = await axiosInstance.get("/status");

  if (res.status != 200) {
    worker.free = false;
    return worker;
  } else {
    if (res.data.status) {
      worker.free = true;
      return worker;
    } else {
      worker.free = false;
      return worker;
    }
  }
}

export async function convertChapter(worker: Worker, id: number): Promise<boolean> {
  const axiosInstance = axios.create({
    baseURL: worker.path,
    timeout: 1000
  });

  $log.debug("convertChapter:" + worker.path + " (" + id + ")");
  const res = await axiosInstance.put("/" + id);

  return res.status == 200;
}
