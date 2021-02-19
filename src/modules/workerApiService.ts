import axios from "axios";
import qs from "qs";
import { Worker } from "../models/Worker";

export async function checkStatus(worker: Worker): Promise<Worker> {
  const axiosInstance = axios.create({
    baseURL: worker.path,
    timeout: 1000
  });

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

  const res = await axiosInstance.put("/convert", qs.stringify({ 'id': id }));


  return res.status == 200;
}