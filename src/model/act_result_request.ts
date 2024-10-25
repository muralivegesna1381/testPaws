export interface ActResultRequest {
  actId: number;
  taskType: number;
  userInfoId: number;
  flow: string;
  animals: Animal[];
}

export interface Animal {
  animalId: number;
  actScheduleId: number;
}
