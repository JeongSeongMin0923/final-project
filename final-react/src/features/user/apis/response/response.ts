import { ResponseCode, ResponseMessage } from "../../types/enums";

export default interface Response {
  code: ResponseCode;
  message: ResponseMessage;
}