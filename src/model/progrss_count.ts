export interface ProgressBardResult {
  status: Status;
  response: ProgrssBarResponse;
}

export interface ProgrssBarResponse {
  progressBarCount: number;
  tasksList: TasksList[];
}
export interface Status {
  success: boolean;
  httpStatus: number;
}
export interface TasksList {
  taskBarName: string;
  taskBarId: number;
  count: number;
}
