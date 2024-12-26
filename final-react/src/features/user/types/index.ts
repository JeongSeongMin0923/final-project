import { Response } from "../apis/response";

type ResponseBody<T> = T | Response | null;

export type {
  ResponseBody
}