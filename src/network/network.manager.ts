import axios from "axios";
import Utils from "../utils";
import { Alert } from "react-native";
import ModalComponent from "../components/modal.component";
import { Rooms } from "../model/rooms_model";
import { UserInfo } from "../model/rooom_preference_model";
import { Species } from "../model/species_model";
import { ActResultRequest } from "../model/act_result_request";
import { DVCListResponse } from "../model/dvc_model";
import { RecordGrpuActRequst } from "../model/act_save_object_model";
import { BASE_URL, BASE_URL_LOAD_BOWL } from "../../App";

import {
  createRecodTable,
  deleteRecordByRecordId,
  deleteRecordByUserId,
  getAllItems,
  getDBConnection,
  OfflineObject,
  saveRequestObject,
} from "../offline/offline-db";
//const BASE_URL = "http://10.200.10.123:7780/pawsdigital/api/v1";
//const BASE_URL = "http://10.200.10.123:7778/pawsdigital/api/v1";
const LOGIN = "/users/authenticate";
/// Notifications
const NOTIFICATIONS = "/user-notification/";
const GET_PENDING_ACT_LIST = "/dashboard/act";
const GET_FMT_COUNT = "/dashboard/fmt-tasks";
const GET_MONITOR_COUNT = "/dashboard/monitor-counts";
const GET_ROOMS_USERS = "/lookup/room-user-monitor";
const GET_DASHBOARD_PENDING_TASK_COUNT = "/dashboard/pending-tasks-count";
//const BASE_URL_BOWL_DETAILS = "http://172.16.0.42:83/SessionDetails.asmx/";
// const BASE_URL_BOWL_DETAILS =
//   "http://10.202.10.63/PawsDigitalService/PawsDigital.asmx/";
const GetCageFeederDetails = "GetCageFeederDetails?scanBowlID=";
const GetSessionBowlsLoaded = "GetSessionBowlsLoaded?feedingSession=";
const updateSessionStatusURL = "UpdateSessionStatus?Json=";
const GetSessionDetail = "GetSessionDetail?bowlId=";
const GetAnimalSessionDetail = "GetAnimalSessionDetail?feedingSession=";
const SetLoadBowlDetails = "SetLoadBowlDetails?";

const GET_PENDING_COLLECTIONS = "/dashboard/pending-collections";
const LOOKUP_ACT_NAMES = "/lookup/acts";
const LOOKUP_LOCATION = "/lookup/locations";
const LOOKUP_TEST = "/lookup/tests";
const SAMPLE_LOOKUP = "/lookup/sample-type";
const LOOKUP_FMT = "/lookup/fmts";
const LOGOUT = "/users/logout";
const USERS_INFO = "/users";
//lookup/rooms/{species-id}?species-id=0
const LOOKUP_LOCATION_SPECIES = "/lookup/rooms/{species-id}?species-id";
const LOOKUP_ALL_LOCATION = "/lookup/allLocations";
const LOOKUP_SPECIES = "/lookup/species";
const USER_PREFERENCE = "/users/preferences";
const LOOKUP_ANIMALS_BY_NAME = "/lookup/animals";
//const LOOKUP_LOCATIONS_BY_NAME = "/lookup/locations";
const LOOKUP_DVC = "/lookup/dvc";
const LOOKUP_USERS = "/lookup/users";
const ACTS = "/act";
const SCHEDULE_ANIMALS = "/act/get-scheduled-animals";
const CHANGE_PASS = "/users/password";
const RESCHEDULEACT = "/act/reschedule";
const MARK_AS_COMPLETE_ACT = "/act/completed";
const MARK_AS_FAILED = "/act/failed";
const NOT_PERFORMED_ACT = "/act/not-performed";
const ACT_DELETE = "/act/delete";
const PASS_RESET = "/users/password/reset";
const GET_ACT_RESULTS = "/act/results";
const GET_ACT_RESULTS_SAVE = "/act/save-results";
const AUDIT_ENTITY_TYPES = "/audit/entity-type";
const AUDIT_ENTITY = "/audit/entity";
const AUDIT_DETAILS = "/audit";
const EXPORT_AUDIT_DETAILS = "/audit/export-audit-logs/";
const ANIMAL_IMAGE = "/image/animal-image";
export const ANIMAL_IMAGE_LINK = "/files/thumbnail-image/";
// const doUserLogin = async (urlPath: string, data: any) => {
//   const result = await fetch(urlPath, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Accept: "*/*",
//     },
//     body: JSON.stringify(data),
//   });
//   const jsonResponse = await result.json();
//   return result;
// };

const doLoginUser = async (urlPath: string, data: string) => {
  const res = axios
    .post(urlPath, data)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.error(
        "ERROR doLoginUser:",
        error?.response?.data?.status?.httpStatus
      );
      //Alert.alert("Network error", error.message);
      return error?.response?.data;
    });

  //dispatch(saveUserData(res));

  return res;
};

const notPerformedACT = async (
  urlPath: string,
  //userId: string,
  comments: string,
  scheduleIds: string
) => {
  var accessToken = await Utils.getData("Token");
  var userId = await Utils.getData("UserId");
  let notPerformedUrl = urlPath;
  const res = axios
    .put(
      notPerformedUrl,
      {
        actScheduleIds: scheduleIds,
        comments: comments,
        userId: userId,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
          Accept: "application/json",
        },
      }
    )
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.error("ERROR notPerformedACT : ", error);
      return error.response.data;
    });
  return res;
};

const deleteACT = async (
  urlPath: string,
  //userId: string,
  scheduleIds: string
) => {
  var accessToken = await Utils.getData("Token");
  var userId = await Utils.getData("UserId");
  let notPerformedUrl = urlPath;
  const res = axios
    .put(
      notPerformedUrl,
      {
        actScheduleIds: scheduleIds,
        userId: userId,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
          Accept: "application/json",
        },
      }
    )
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.error("ERROR notPerformedACT : ", error);
      return error.response.data;
    });
  return res;
};

const completedACT = async (
  urlPath: string,
  //userId: string,
  comments: string,
  scheduleIds: string,
  performedBy: number,
  performedDate: string
) => {
  var accessToken = await Utils.getData("Token");
  var userId = await Utils.getData("UserId");
  let reqBody = {
    actScheduleIds: scheduleIds,
    comments: comments,
    userId: userId,
    performedBy: performedBy,
    performedDate: performedDate,
  };
  let completedACTUrl = urlPath;
  const res = axios
    .put(completedACTUrl, reqBody, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
        Accept: "application/json",
      },
    })
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.error("ERROR notPerformedACT : ", error);
      return error.response.data;
    });
  return res;
};

const markAsFailedACT = async (
  urlPath: string,
  //userId: string,
  comments: string,
  scheduleIds: string
) => {
  var accessToken = await Utils.getData("Token");
  var userId = await Utils.getData("UserId");
  let markAsFailedACTUrl = urlPath;
  const res = axios
    .put(
      markAsFailedACTUrl,
      {
        actScheduleIds: scheduleIds,
        comments: comments,
        userId: userId,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
          Accept: "application/json",
        },
      }
    )
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.error("ERROR notPerformedACT : ", error);
      return error.response.data;
    });
  return res;
};

const markAsRescheduleACT = async (
  urlPath: string,
  //userId: string,
  comments: string,
  scheduleIds: string,
  rescheduleDate: string
) => {
  var accessToken = await Utils.getData("Token");
  var userId = await Utils.getData("UserId");
  let markAsRescheduleACTUrl = urlPath;
  const res = axios
    .put(
      markAsRescheduleACTUrl,
      {
        actScheduleIds: scheduleIds,
        comments: comments,
        userId: userId,
        rescheduleDate: rescheduleDate,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
          Accept: "application/json",
        },
      }
    )
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.error("ERROR notPerformedACT : ", error);
      return error.response.data;
    });
  return res;
};

const getNotificaions = async (
  urlPath: string,
  userId: string,
  startIndex: number,
  limit: number
) => {
  var accessToken = await Utils.getData("Token");
  let requestUrl =
    urlPath + userId + "?startIndex=" + startIndex + "&limit=" + limit;

  const res = axios
    .get(requestUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    })
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.error("ERROR doLoginUser : ", error);
      return error?.response?.data;
    });
  return res;
};
/*  var accessToken =  Utils.getData("Token");
const headers = {
  Authorization: "Bearer accessToken",
  
}; */

const notificationDelete = async (
  urlPath: string,
  userId: string,
  notificationId: number
) => {
  var accessToken = await Utils.getData("Token");
  let deleteUrl = urlPath + userId + "?notificationIds=" + notificationId;
  const res = axios
    .put(deleteUrl, "", {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
        Accept: "application/json",
      },
    })
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.error("ERROR delete Notification : ", error);
      return error.response.data;
    });
  return res;
};
const getDashboardMonitorCounts = async (
  urlPath: string,
  data: string,
  statusID: string
) => {
  var accessToken = await Utils.getData("Token");
  var userId = await Utils.getData("UserId");

  urlPath = urlPath + "/" + userId + "/" + statusID;
  const res = axios
    .get(urlPath, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    })
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      // console.error("ERROR monitor counts : ", error);
      return error;
    });
  return res;
};
const getDashboardPendingTasksCount = async (urlPath: string, data: string) => {
  var userId = await Utils.getData("UserId");

  var accessToken = await Utils.getData("Token");
  urlPath = urlPath + "/" + userId;
  const res = axios
    .get(urlPath, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    })
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.error("ERROR dashboard counts : ", error);
      return error;
    });
  return res;
};

const getBowlDetails = async (urlPath: string) => {
  const res = axios
    .get(urlPath)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.error("ERROR getBowlDetails : ", error);
      return error;
    });
  return res;
};

const getSessionBowlsLoaded = async (urlPath: string) => {
  const res = axios
    .get(urlPath)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      return error;
    });
  return res;
};

const updateSessionStatus = async (urlPath: string) => {
  const res = axios
    .get(urlPath)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.error("ERROR updateSessionStatus : ", error);
      return error;
    });

  //dispatch(saveUserData(res));

  return res;
};

/**
 *
 * @param urlPath url path
 * @param query
 * @param type
 * @returns Rooms
 */
const getRoomAndUserData = async (
  urlPath: string,
  query: string,
  type: number
): Promise<Rooms> => {
  var accessToken = await Utils.getData("Token");
  urlPath = urlPath + "/" + type + "?query=" + query;
  const res = axios
    .get(urlPath, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    })
    .then(function (response) {
      return response?.data;
    })
    .catch(function (error) {
      console.error("ERROR getRoomAndUserData: ", error);
      return error?.response?.data;
    });
  return res;
};

const getPendingACTList = async (
  urlPath: string,
  startIndex: number,
  limit: number,
  actStatusId: number,
  startDate: string,
  endDate: string,
  userInfoID: number,
  actId: any,
  location: any,
  test: any,
  sortBy: any,
  order: any,
  status: any
) => {
  var accessToken = await Utils.getData("Token");

  let requestUrl =
    urlPath +
    "/" +
    userInfoID +
    "?startIndex=" +
    startIndex +
    "&limit=" +
    limit +
    "&actStatusId=" +
    actStatusId +
    "&fromDate=" +
    startDate +
    "&toDate=" +
    endDate +
    "&actId=" +
    actId +
    "&facilityLocation=" +
    location +
    "&testNum=" +
    test +
    "&sortBy=" +
    sortBy +
    "&order=" +
    order +
    "&typeId=" +
    status;
  const res = axios
    .get(requestUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    })
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.error("ERROR doLoginUser : ", error);
      return error;
    });
  return res;
};

const getFMTTasks = async (
  urlPath: string,
  startIndex: number,
  limit: number,
  userInfoID: number,
  statusID: number,
  sortBy: string,
  order: string,
  fromDate: string,
  toDate: string,
  fmtName: string,
  location: any,
  status: string
) => {
  var accessToken = await Utils.getData("Token");
  let requestUrl =
    urlPath +
    "/" +
    userInfoID +
    "?startIndex=" +
    startIndex +
    "&limit=" +
    limit +
    "&statusId=" +
    statusID +
    "&sortBy=" +
    sortBy +
    "&order=" +
    order +
    "&fromDate=" +
    fromDate +
    "&toDate=" +
    toDate +
    "&fmtName=" +
    fmtName +
    "&facilityLocation=" +
    location +
    "&typeId=" +
    status;
  const res = axios
    .get(requestUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    })
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.error("ERROR FMT : ", error);
      return error;
    });
  return res;
};

const getPendingCollections = async (
  urlPath: string,
  startIndex: number,
  limit: number,
  userInfoID: number,
  actId: number,
  sortBy: string,
  order: string,
  sampleId: number,
  testNum: any
) => {
  var accessToken = await Utils.getData("Token");
  let requestUrl =
    urlPath +
    "/" +
    userInfoID +
    "?startIndex=" +
    startIndex +
    "&limit=" +
    limit +
    "&actStatusId=" +
    actId +
    "&sortBy=" +
    sortBy +
    "&order=" +
    order;
  if (sampleId) {
    if (!requestUrl.includes("?")) {
      requestUrl = requestUrl + "?";
    }
    requestUrl = requestUrl + "&sampleTypeId=" + sampleId;
  }
  if (testNum) {
    if (!requestUrl.includes("?")) {
      requestUrl = requestUrl + "?";
    }
    requestUrl = requestUrl + "&testNum=" + testNum;
  }
  // +
  // "&sampleTypeId=" +
  // sampleId +
  // "&testNum=" +
  // testNum;
  const res = axios
    .get(requestUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    })
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.error("ERROR PEDNINGCOLL : ", error);
      return error;
    });
  return res;
};

const getLookUpACTNames = async (urlPath: string, data: any) => {
  var userId = await Utils.getData("UserId");
  if (data) {
    urlPath = urlPath + "?flow=" + data + "&userId=" + userId;
  }
  var accessToken = await Utils.getData("Token");
  const res = axios
    .get(urlPath, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    })
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.error("ERROR getLookUpACTNames : ", error);
      return error;
    });
  return res;
};

const getLookUpLocationNames = async (
  urlPath: string,
  speciesId: number,
  apiParam: string
) => {
  var accessToken = await Utils.getData("Token");
  let url =
    urlPath +
    "?startIndex=0" +
    "&limit=2000&species-id=" +
    speciesId +
    "&order=DESC" +
    "&flow=" +
    apiParam;

  console.log("TEST get getLookUpLocationNames 693=>", url);
  const res = axios
    .get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    })
    .then(function (response) {
      return response?.data;
    })
    .catch(function (error) {
      console.error("ERROR getLookUpLocationNames : ", error);
      return error?.response?.data;
    });
  return res;
};

const getLookUpSampleTypes = async (urlPath: string) => {
  var accessToken = await Utils.getData("Token");
  const res = axios
    .get(urlPath, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    })
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.error("ERROR getLookUpSampleTypes : ", error);
      return error;
    });
  return res;
};

const getLookUpFMTNames = async (urlPath: string) => {
  var accessToken = await Utils.getData("Token");
  const res = axios
    .get(urlPath, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    })
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.error("ERROR getLookUpFMTNames : ", error);
      return error;
    });
  return res;
};

const getLookUpTestNames = async (urlPath: string, data: any) => {
  let url = urlPath + "?query=" + data;
  var accessToken = await Utils.getData("Token");
  const res = axios
    .get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    })
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.error("ERROR getLookUpTestNames : ", error);
      return error;
    });
  return res;
};

const getfeedingAnimalSessions = async (urlPath: string) => {
  const res = axios
    .get(urlPath)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.error("ERROR getBowlDetails : ", error);
      return error;
    });
  return res;
};

const setLoadBowlDetails = async (urlPath: string) => {
  const res = axios
    .get(urlPath)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.error("ERROR setLoadBowlDetails : ", error);
      return error;
    });
  return res;
};

const doUserLogout = async (urlPath: string) => {
  var accessToken = await Utils.getData("Token");
  const res = axios
    .post(urlPath, null, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + accessToken,
      },
    })
    .then(function (response) {
      return response?.data;
    })
    .catch(function (error) {
      return error.response?.data;
    });
  return res;
};

const getUserInfo = async (
  urlPath: string,
  userId: string
): Promise<UserInfo> => {
  var accessToken = await Utils.getData("Token");
  //TODO need to update user ID from SP
  let url = urlPath + "/" + userId;
  const res = axios
    .get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    })
    .then(function (response) {
      return response?.data;
    })
    .catch(function (error) {
      // console.error("ERROR doUserLogout : ", error.response.data);
      return error.response?.data;
    });
  return res;
};

const setRoomPreference = async (
  urlPath: string,
  request: { UserId: number; FacilityLocationId: number[]; SpeciesId: number }
) => {
  var accessToken = await Utils.getData("Token");
  // let preferenceUrl = urlPath + userId + "?notificationIds=" + notificationId;
  const res = axios
    .post(urlPath, request, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
        Accept: "application/json",
      },
    })
    .then(function (response) {
      return response?.data;
    })
    .catch(function (error) {
      console.error("ERROR  setRoomPreference : ", error?.response?.data);
      return error?.response?.data;
    });
  return res;
};

const getSpecies = async (urlPath: string): Promise<Species> => {
  var accessToken = await Utils.getData("Token");
  //TODO need to update user ID from SP
  const res = axios
    .get(urlPath, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    })
    .then(function (response) {
      return response?.data;
    })
    .catch(function (error) {
      // console.error("ERROR doUserLogout : ", error.response.data);
      return error.response?.data;
    });
  return res;
};
const getRoomsListBySpecies = async (
  urlPath: string,
  species: number
): Promise<any> => {
  var accessToken = await Utils.getData("Token");
  //TODO need to update user ID from SP
  //let url = urlPath + "=" + species;
  let url = urlPath + "?limit=2000&order=ASC" + "&species-id=" + species ?? "";
  const res = axios
    .get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    })
    .then(function (response) {
      return response?.data;
    })
    .catch(function (error) {
      // console.error("ERROR doUserLogout : ", error.response.data);
      return error.response?.data;
    });
  return res;
};

const getActs = async (urlPath: string, type: number, Id: String) => {
  var accessToken = await Utils.getData("Token");
  let requestUrl = urlPath + "?type=" + type + "&Ids=" + Id;
  const res = axios
    .get(requestUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
        Accept: "application/json",
      },
    })
    .then(function (response) {
      return response?.data;
    })
    .catch(function (error) {
      console.error("ERROR GETACTS : ", error);
      return error;
    });
  return res;
};

const getScheduledAnimals = async (
  urlPath: string,
  type: number,
  actID: number,
  selectedTypeID: any,
  fromDate: string,
  toDate: string
) => {
  var accessToken = await Utils.getData("Token");
  let requestUrl =
    urlPath +
    "?type=" +
    type +
    "&Id=" +
    selectedTypeID +
    "&actId=" +
    actID +
    "&fromDate=" +
    fromDate +
    "&toDate=" +
    toDate;
  const res = axios
    .get(requestUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
        Accept: "application/json",
      },
    })
    .then(function (response) {
      return response?.data;
    })
    .catch(function (error) {
      console.error("ERROR getScheduledAnimals : ", error);
      return error.response?.data;
    });
  return res;
};

const getACTResults = async (urlPath: string, request: ActResultRequest) => {
  var accessToken = await Utils.getData("Token");
  const res = axios
    .post(urlPath, request, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
        Accept: "application/json",
      },
    })
    .then(function (response) {
      return response?.data;
    })
    .catch(function (error) {
      console.error("ERROR  getACTResults : ", error?.response?.data);
      return error?.response?.data;
    });
  return res;
};

const getAnimalsByName = async (
  urlPath: string,
  startIndex: number,
  limit: number,
  userInfoID: number,
  query: string,
  sortBy: string,
  order: string
) => {
  var accessToken = await Utils.getData("Token");
  let requestUrl =
    urlPath +
    "?startIndex=" +
    startIndex +
    "&user-info-id=" +
    userInfoID +
    "&query=" +
    query +
    "&order=" +
    order +
    "&limit=" +
    limit;
  // if (query.length > 0) {
  //   requestUrl = requestUrl + "&query=" + query
  // }
  const res = axios
    .get(requestUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
        Accept: "application/json",
      },
    })
    .then(function (response) {
      return response?.data;
    })
    .catch(function (error) {
      console.error("ERROR getAnimalsByName : ", error);
      return error?.response?.data;
    });
  return res;
};

const getLocationsByName = async (
  urlPath: string,
  startIndex: number,
  limit: number,
  userInfoID: number,
  query: string,
  order: string,
  flow: string
) => {
  var accessToken = await Utils.getData("Token");
  let requestUrl =
    urlPath +
    "?startIndex=" +
    startIndex +
    "&user-info-id=" +
    userInfoID +
    "&query=" +
    query +
    "&limit=" +
    limit +
    "&order=" +
    order +
    "&flow=" +
    flow; //+
  // "&sortBy=" +
  // sortBy

  // if (query.length > 0) {
  //   requestUrl = requestUrl + "&query=" + query
  // }
  console.log("TEST location req 1072:=>", requestUrl);
  const res = axios
    .get(requestUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
        Accept: "application/json",
      },
    })
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.error("ERROR getLocationsByName : ", error);
      return error;
    });
  return res;
};

const getDVCs = async (urlPath: string) => {
  var accessToken = await Utils.getData("Token");
  //TODO need to update user ID from SP
  const res = axios
    .get(urlPath, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    })
    .then(function (response) {
      return response?.data;
    })
    .catch(function (error) {
      console.error("ERROR doUserLogout : ", error?.response?.data);
      return error.response?.data;
    });
  return res;
};

const getLookUpUsers = async (urlPath: string) => {
  var accessToken = await Utils.getData("Token");
  // var userId = await Utils.getData("UserId");
  let url = urlPath + "/" + 2;
  const res = axios
    .get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    })
    .then(function (response) {
      return response?.data;
    })
    .catch(function (error) {
      return error.response?.data;
    });
  return res;
};

const doPasswordChange = async (
  urlPath: string,
  requestBody: { oldPassword: string; newPassword: string; flow: string }
): Promise<any> => {
  var accessToken = await Utils.getData("Token");
  const res = axios
    .put(urlPath, requestBody, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    })
    .then(function (response) {
      return response?.data;
    })
    .catch(function (error) {
      // console.error("ERROR doPasswordChange : ", error.response.data);
      return error.response?.data;
    });
  return res;
};

const doPasswordReset = async (
  urlPath: string,
  userName: string
): Promise<any> => {
  urlPath = urlPath + "/" + userName;
  let newURl = new URLSearchParams({ url: urlPath });
  const res = axios
    .put(urlPath, null, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then(function (response) {
      return response?.data;
    })
    .catch(function (error) {
      return error.response?.data;
    });
  return res;
};

const actMarkAsReadPut = async (urlPath: string) => {
  var accessToken = await Utils.getData("Token");
  //TODO need to update user ID from SP
  const res = axios
    .get(urlPath, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    })
    .then(function (response) {
      return response?.data;
    })
    .catch(function (error) {
      return error.response?.data;
    });
  return res;
};

const actListDetails = async (urlPath: string) => {
  var accessToken = await Utils.getData("Token");
  //TODO need to update user ID from SP
  const res = axios
    .get(urlPath, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    })
    .then(function (response) {
      return response?.data;
    })
    .catch(function (error) {
      // console.error("ERROR doUserLogout : ", error.response.data);
      return error.response?.data;
    });
  return res;
};

/**
 *
 * @param urlPath
 * @param requestBody GroupActSave Request
 * @returns Group Act response
 */
const saveGroupActResults = async (
  urlPath: string,
  requestBody: RecordGrpuActRequst
) => {
  var accessToken = await Utils.getData("Token");
  const res = axios
    .post(urlPath, requestBody, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
        Accept: "application/json",
      },
    })
    .then(function (response) {
      return response?.data;
    })
    .catch(function (error) {
      //console.error("ERROR  getACTResults : ", error?.response?.data);
      return error?.response?.data;
    });
  return res;
};

const getAuditEntityTypes = async (urlPath: string) => {
  var accessToken = await Utils.getData("Token");
  const res = axios
    .get(urlPath, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    })
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.error("ERROR Audit Entity Types : ", error);
      return error;
    });
  return res;
};

const getAuditEntity = async (urlPath: string) => {
  var accessToken = await Utils.getData("Token");
  const res = axios
    .get(urlPath, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    })
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.error("ERROR Audit Entity : ", error);
      return error;
    });
  return res;
};

// const getLookUpUsers = async (urlPath: string) => {
//   var accessToken = await Utils.getData("Token");
//   const res = axios
//     .get(urlPath, {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: "Bearer " + accessToken,
//       },
//     })
//     .then(function (response) {
//       return response.data;
//     })
//     .catch(function (error) {
//       console.error("ERROR Audit Entity : ", error);
//       return error;
//     });
//   return res;
// };

const getAuditDetailsList = async (
  urlPath: string,
  startDate: string,
  endDate: string,
  entityTypeId: any,
  entity: any,
  user: any
) => {
  var accessToken = await Utils.getData("Token");
  let requestUrl = urlPath;
  if (user != "") {
    if (!requestUrl.includes("?")) {
      requestUrl = requestUrl + "?";
    }
    requestUrl = requestUrl + "&user-info-id=" + user;
  }
  if (entityTypeId != "") {
    if (!requestUrl.includes("?")) {
      requestUrl = requestUrl + "?";
    }
    requestUrl = requestUrl + "&entityTypeId=" + entityTypeId;
  }
  if (startDate != "") {
    if (!requestUrl.includes("?")) {
      requestUrl = requestUrl + "?";
    }
    requestUrl = requestUrl + "&startDate=" + startDate;
  }
  if (endDate != "") {
    if (!requestUrl.includes("?")) {
      requestUrl = requestUrl + "?";
    }
    requestUrl = requestUrl + "&endDate=" + endDate;
  }
  if (entity != "") {
    if (!requestUrl.includes("?")) {
      requestUrl = requestUrl + "?";
    }
    requestUrl = requestUrl + "&entity=" + entity;
  }
  if (requestUrl.includes("?&")) {
    requestUrl = requestUrl.replaceAll("?&", "?");
  }
  const res = axios
    .get(requestUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    })
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.error("ERROR getAuditDetailsList : ", error);
      return error;
    });
  return res;
};

const exportAuditDetails = async (
  urlPath: string,
  startDate: string,
  endDate: string,
  entityTypeId: any,
  entity: any,
  user: any
) => {
  var accessToken = await Utils.getData("Token");
  let requestUrl = urlPath;
  if (user != "") {
    if (!requestUrl.includes("?")) {
      requestUrl = requestUrl + "?";
    }
    requestUrl = requestUrl + "&user-info-id=" + user;
  }
  if (entityTypeId != "") {
    if (!requestUrl.includes("?")) {
      requestUrl = requestUrl + "?";
    }
    requestUrl = requestUrl + "&entityTypeId=" + entityTypeId;
  }
  if (startDate != "") {
    if (!requestUrl.includes("?")) {
      requestUrl = requestUrl + "?";
    }
    requestUrl = requestUrl + "&startDate=" + startDate;
  }
  if (endDate != "") {
    if (!requestUrl.includes("?")) {
      requestUrl = requestUrl + "?";
    }
    requestUrl = requestUrl + "&endDate=" + endDate;
  }
  if (entity != "") {
    if (!requestUrl.includes("?")) {
      requestUrl = requestUrl + "?";
    }
    requestUrl = requestUrl + "&entity=" + entity;
  }
  if (requestUrl.includes("?&")) {
    requestUrl = requestUrl.replaceAll("?&", "?");
  }
  const res = axios
    .get(requestUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    })
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.error("ERROR getAuditDetailsList : ", error);
      return error;
    });
  return res;
};

const getAnimalImage = async (urlPath: string, animalId: number) => {
  let imageUrl = urlPath + "/" + animalId;
  var accessToken = await Utils.getData("Token");
  const res = axios
    .get(imageUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    })
    .then(function (response) {
      return response?.data;
    })
    .catch(function (error) {
      console.error("ERROR getAnimalImage : ", error);
      return error;
    });
  return res;
};

const NetworkManager = {
  doLogin: async (data: any) => {
    //console.log("TEST base url", BASE_URL);
    let result = await doLoginUser(BASE_URL + LOGIN, data);
    return result;
  },
  getUserNotifications: async (
    userId: string,
    startIndex: number,
    limit: number
  ) => {
    let result = await getNotificaions(
      BASE_URL + NOTIFICATIONS,
      userId,
      startIndex,
      limit
    );
    return result;
  },
  getPendingACTList: async (
    startIndex: any,
    limit: any,
    actStatusId: any,
    startDate: any,
    endDate: any,
    userInfoID: any,
    actId: any,
    location: any,
    test: any,
    sortBy: any,
    order: any,
    status: any
  ) => {
    let result = await getPendingACTList(
      BASE_URL + GET_PENDING_ACT_LIST,
      startIndex,
      limit,
      actStatusId,
      startDate,
      endDate,
      userInfoID,
      actId,
      location,
      test,
      sortBy,
      order,
      status
    );
    return result;
  },
  getFMTList: async (
    startIndex: any,
    limit: any,
    userinfoid: any,
    statusID: any,
    sortBy: any,
    order: any,
    fromDate: any,
    toDate: any,
    fmtName: any,
    location: any,
    status: string
  ) => {
    let result = await getFMTTasks(
      BASE_URL + GET_FMT_COUNT,
      startIndex,
      limit,
      userinfoid,
      statusID,
      sortBy,
      order,
      fromDate,
      toDate,
      fmtName,
      location,
      status
    );
    return result;
  },
  getPendingCollections: async (
    startIndex: any,
    limit: any,
    userinfoid: any,
    actId: any,
    sortBy: any,
    order: any,
    sampleId: any,
    testNum: any
  ) => {
    let result = await getPendingCollections(
      BASE_URL + GET_PENDING_COLLECTIONS,
      startIndex,
      limit,
      userinfoid,
      actId,
      sortBy,
      order,
      sampleId,
      testNum
    );
    return result;
  },
  deleteNotification: async (userId: string, notificationId: any) => {
    let result = await notificationDelete(
      BASE_URL + NOTIFICATIONS,
      userId,
      notificationId
    );
    return result;
  },
  getDashboardMonitorCounts: async (data: any, statusID: any) => {
    let result = await getDashboardMonitorCounts(
      BASE_URL + GET_MONITOR_COUNT,
      data,
      statusID
    );
    return result;
  },
  getDashboardPendingTasksCount: async (data: any) => {
    let result = await getDashboardPendingTasksCount(
      BASE_URL + GET_DASHBOARD_PENDING_TASK_COUNT,
      data
    );
    return result;
  },
  getRoomAndUserList: async (query: string, type: number) => {
    let result = await getRoomAndUserData(
      BASE_URL + GET_ROOMS_USERS,
      query,
      type
    );
    return result;
  },
  getBowlDetails: async (data: any) => {
    let result = await getBowlDetails(
      BASE_URL_LOAD_BOWL + GetCageFeederDetails + data
    );
    return result;
  },
  actMarkAsFailed: async (actScheduleID: string, comments: string) => {
    let result = await markAsFailedACT(
      BASE_URL + MARK_AS_FAILED,
      comments,
      actScheduleID
    );
    return result;
  },
  actReschedule: async (
    comments: string,
    actScheduleID: string,
    rescheduleDate: string
  ) => {
    let result = await markAsRescheduleACT(
      BASE_URL + RESCHEDULEACT,
      comments,
      actScheduleID,
      rescheduleDate
    );
    return result;
  },
  actMarkAsComplete: async (
    comments: string,
    actScheduleID: string,
    performedBy: number,
    performedDate: string
  ) => {
    let result = await completedACT(
      BASE_URL + MARK_AS_COMPLETE_ACT,
      comments,
      actScheduleID,
      performedBy,
      performedDate
    );
    return result;
  },
  actNotPerformed: async (comments: string, actScheduleID: string) => {
    let result = await notPerformedACT(
      BASE_URL + NOT_PERFORMED_ACT,
      comments,
      actScheduleID
    );
    return result;
  },
  actDelete: async (actScheduleID: string) => {
    let result = await deleteACT(BASE_URL + ACT_DELETE, actScheduleID);
    return result;
  },

  getLookUpACTNames: async (data: any) => {
    let result = await getLookUpACTNames(BASE_URL + LOOKUP_ACT_NAMES, data);
    return result;
  },

  getLookUpLocationNames: async (speciesId: any, apiParam: string) => {
    let result = await getLookUpLocationNames(
      BASE_URL + LOOKUP_LOCATION,
      speciesId,
      apiParam
    );

    return result;
  },

  getLookUpTestNames: async (data: any) => {
    let result = await getLookUpTestNames(BASE_URL + LOOKUP_TEST, data);
    return result;
  },
  getLookUpSampleTypes: async (data: any) => {
    let result = await getLookUpSampleTypes(BASE_URL + SAMPLE_LOOKUP);
    return result;
  },
  getLookUpFMTNames: async (data: any) => {
    let result = await getLookUpFMTNames(BASE_URL + LOOKUP_FMT);
    return result;
  },

  updateSessionStatus: async (data: any) => {
    let result = await updateSessionStatus(
      BASE_URL_LOAD_BOWL + updateSessionStatusURL + JSON.stringify(data)
    );
    return result;
  },

  getSessionBowlsLoaded: async (data: any) => {
    let result = await getSessionBowlsLoaded(
      BASE_URL_LOAD_BOWL + GetSessionBowlsLoaded + data
    );
    return result;
  },

  getSessionDetail: async (data: any) => {
    let result = await getBowlDetails(
      BASE_URL_LOAD_BOWL + GetSessionDetail + data
    );
    return result;
  },

  getfeedingAnimalSessions: async (data: any) => {
    let result = await getfeedingAnimalSessions(
      BASE_URL_LOAD_BOWL + GetAnimalSessionDetail + data
    );
    return result;
  },

  setLoadBowlDetails: async (data: any) => {
    let result = await setLoadBowlDetails(
      BASE_URL_LOAD_BOWL + SetLoadBowlDetails + data
    );
    return result;
  },

  doLogout: async () => {
    let result = await doUserLogout(BASE_URL + LOGOUT);
    return result;
  },

  doGetUserInfo: async (userId: string) => {
    let result = await getUserInfo(BASE_URL + USERS_INFO, userId);
    return result;
  },

  getSpeciesList: async () => {
    let result = await getSpecies(BASE_URL + LOOKUP_SPECIES);
    return result;
  },
  getRoomsListBasedOnSpecies: async (speciesId: number) => {
    let result = await getRoomsListBySpecies(
      BASE_URL + LOOKUP_ALL_LOCATION,
      speciesId
    );
    return result;
  },

  setRoomPreference: async (requestObject: {
    UserId: number;
    FacilityLocationId: number[];
    SpeciesId: number;
  }) => {
    let result = await setRoomPreference(
      BASE_URL + USER_PREFERENCE,
      requestObject
    );
    return result;
  },

  getAnimalsByName: async (
    startIndex: any,
    limit: any,
    userinfoid: any,
    query: any,
    sortBy: any,
    order: any
  ) => {
    let result = await getAnimalsByName(
      BASE_URL + LOOKUP_ANIMALS_BY_NAME,
      startIndex,
      limit,
      userinfoid,
      query,
      sortBy,
      order
    );
    return result;
  },

  getLocationsByName: async (
    startIndex: any,
    limit: any,
    userinfoid: any,
    query: any,
    order: any,
    flow: string
  ) => {
    let result = await getLocationsByName(
      BASE_URL + LOOKUP_LOCATION,
      startIndex,
      limit,
      userinfoid,
      query,
      order,
      flow
    );
    return result;
  },

  getActs: async (type: number, Id: String) => {
    let result = await getActs(BASE_URL + ACTS, type, Id);
    return result;
  },

  getScheduledAnimals: async (
    type: number,
    actID: number,
    selectedTypeID: any,
    fromDate: string,
    toDate: string
  ) => {
    let result = await getScheduledAnimals(
      BASE_URL + SCHEDULE_ANIMALS,
      type,
      actID,
      selectedTypeID,
      fromDate,
      toDate
    );
    return result;
  },

  getACTResults: async (requestBody: ActResultRequest) => {
    let result = await getACTResults(BASE_URL + GET_ACT_RESULTS, requestBody);
    return result;
  },

  requestPasswordChange: async (requestBody: {
    oldPassword: string;
    newPassword: string;
    flow: string;
  }) => {
    let reponse = await doPasswordChange(BASE_URL + CHANGE_PASS, requestBody);
    return reponse;
  },
  requestPasswordReset: async (userName: string) => {
    let password_reponse = await doPasswordReset(
      BASE_URL + PASS_RESET,
      userName
    );
    return password_reponse;
  },

  getDVCList: async () => {
    let dvcs: DVCListResponse[] = await getDVCs(BASE_URL + LOOKUP_DVC);
    return dvcs;
  },
  getLookUpUsers: async () => {
    let dvcs = await getLookUpUsers(BASE_URL + LOOKUP_USERS);
    return dvcs;
  },

  saveGroupActResults: async (
    requestBody: RecordGrpuActRequst,
    isOnline: boolean = true
  ) => {
    if (isOnline) {
      let groupActResponse = await saveGroupActResults(
        BASE_URL + GET_ACT_RESULTS_SAVE,
        requestBody
      );
      return groupActResponse;
    } else {
      let result = await Utils.saveOfflineACTRecord(
        BASE_URL + GET_ACT_RESULTS_SAVE,
        requestBody
      );
    }
  },

  getAuditEntityTypes: async () => {
    let result = await getAuditEntityTypes(BASE_URL + AUDIT_ENTITY_TYPES);
    return result;
  },

  getAuditEntity: async () => {
    let result = await getAuditEntity(BASE_URL + AUDIT_ENTITY);
    return result;
  },

  // getLookUpUsers: async () => {
  //   let result = await getLookUpUsers(BASE_URL + LOOKUP_USERS);
  //   return result;
  // },
  getAuditDetailsList: async (
    startDate: any,
    endDate: any,
    entityTypeId: any,
    entity: any,
    user: any
  ) => {
    let result = await getAuditDetailsList(
      BASE_URL + AUDIT_DETAILS,
      startDate,
      endDate,
      entityTypeId,
      entity,
      user
    );
    return result;
  },

  exportAuditDetails: async (
    loginUserId: any,
    startDate: any,
    endDate: any,
    entityTypeId: any,
    entity: any,
    user: any
  ) => {
    let result = await exportAuditDetails(
      BASE_URL + EXPORT_AUDIT_DETAILS + loginUserId,
      startDate,
      endDate,
      entityTypeId,
      entity,
      user
    );
    return result;
  },
  getImageByts: async (animalId: any) => {
    let result = await getAnimalImage(BASE_URL + ANIMAL_IMAGE, animalId);
    return result;
  },
};

export default NetworkManager;
