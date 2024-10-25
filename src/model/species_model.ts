import { Status } from "./rooom_preference_model";

export interface Species {
  status: Status;
  response: SpeciesResponse[];
}

export interface SpeciesResponse {
  speciesId: number;
  speciesName: string;
}
