import { Act } from "./act_save_object_model";
import { Status } from "./rooom_preference_model";

export interface RecordGrpuActReponse {
  status: Status;
  response: ACTResponse;
}

export interface ACTResponse {
  acts: Act[];
}
