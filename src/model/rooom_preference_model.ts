export interface UserInfo {
  errors: any;
  status: Status;
  response: UserInfo_Response;
}
export interface Status {
  success: boolean;
  httpStatus: number;
}

export interface UserInfo_Response {
  userInfoId: number;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  isAdmin: boolean;
  isActive: boolean;
  isLoggedIn: number;
  pwdLastChanged: string;
  isVet: number;
  preferencesAvailable: boolean;
  userRoleList: number[];
  userPermissionsList: any[];
  preferences: Preferences;
}

export interface Preferences {
  locationPreferences: LocationPreference[];
  animalPreferences: AnimalPreference[];
  speciesPreferences: SpeciesPreferences;
}

export interface LocationPreference {
  room: string;
  facilityLocationId: number;
}

export interface AnimalPreference {
  AnimalName: string;
  AnimalId: number;
}

export interface SpeciesPreferences {
  speciesId: number;
  speciesName: any;
}
