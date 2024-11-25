import Utils from "../utils";

// Load bowl Local Base URL
//export const BASE_URL_BOWL_DETAILS =
// "http://172.16.0.42:83/SessionDetails.asmx/";
//Load Bowl UAT URL
//export const BASE_URL_BOWL_DETAILS ="http://10.202.10.63/PawsDigitalService/PawsDigital.asmx/";
//Load Bowl Production URL
//export const BASE_URL_BOWL_DETAILS ="http://10.202.10.63/PawsDigitalProdService/PawsDigital.asmx/";

///Load bowl url prod
export const URL_BOWL_PROD =
  "http://10.202.10.63/PawsDigitalProdService/PawsDigital.asmx/";

///Load bowl url UAT
export const URL_BOWL_UAT =
  "http://10.202.10.63/PawsDigitalService/PawsDigital.asmx/";

///Dev or Testing UAT
export const URL_DEV = "http://10.200.10.123:7780/pawsdigital/api/v1";

//Production
export const URL_QA = "http://10.200.10.103:7779/pawsdigital/api/v1";
//export const URL_QA = "http://10.200.10.123:7778/pawsdigital/api/v1";
// Load bowl
export const GET_CAGE_FEEDER_DETAILS = "GetCageFeederDetails?scanBowlID=";
export const GET_SESSION_BOWLS_LOADED = "GetSessionBowlsLoaded?feedingSession=";
export const UPDATE_SESSION_STATUS_URL = "UpdateSessionStatus?Json=";
export const GET_SESSION_DETAIL = "GetSessionDetail?bowlId=";
export const GET_ANIMAL_SESSION_DETAIL =
  "GetAnimalSessionDetail?feedingSession=";
export const SET_LOAD_BOWL_DETAILS = "SetLoadBowlDetails?";

// Audit logs
export const LOOKUP_USERS = "/lookup/users";
export const AUDIT_ENTITY_TYPES = "/audit/entity-type";
export const AUDIT_ENTITY = "/audit/entity";
export const AUDIT_DETAILS = "/audit";
export const EXPORT_AUDIT_DETAILS = "/audit/export-audit-logs/";
