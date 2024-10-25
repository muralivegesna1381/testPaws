import { Status } from "./rooom_preference_model";

export interface MonitorCount {
  status: Status;
  response: Response;
}
export interface Response {
  notificationCount: number;
  monitors: Monitor[];
}
export interface Monitor {
  monitorId: number;
  monitorName: string;
  monitorCount: number;
}

