import { Status } from "./rooom_preference_model"

export interface ScheduleAnimalRes {
    response: AnimalResponse[]
    status: Status
}

export type AnimalResponse = {
    actId: number
    actName: string
    actScheduleId: number
    animalId: number
    animalNameTattoo: string
    currentLocation: string
    scheduledDate: string,
    isSelected?: boolean;
    testNum:string
}