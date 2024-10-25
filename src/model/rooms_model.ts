export interface Rooms {
  status: Status;
  response: { [key: string]: RoomsResponse[] };
  errors: Error[];
}

export interface RoomsResponse {
  room: string;
  facilityLocationId: number;
  userId: number;
  userName: string;
}

interface Status {
  success: boolean;
  httpStatus: number;
}

export interface Error {
  code: string;
  message: string;
  key: string;
}
