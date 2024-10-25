import { Status } from "./rooom_preference_model";

export interface DVCListResponse {
  status: Status;
  response: DVCResponse[];
}

export interface DVCResponse {
  codeID: string;
  code: string;
  codeDesc: string;
}
