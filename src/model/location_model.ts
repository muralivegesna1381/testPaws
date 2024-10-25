import { RoomType } from "../components/dropdown.component";
import { Status } from "./rooom_preference_model";

export interface LocationsModel {
  status: Status;
  response: RoomType[];
}

// export interface LocationResponse {
//   room: string;
//   facilityLocationId: number;
//   ///This paramer for selection
//   isSelected: boolean;

// }
export default LocationsModel;
