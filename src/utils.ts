import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import Colors from "./styles/color";
import Toast from "react-native-simple-toast";
import {
  createRecodTable,
  deleteRecordByRecordId,
  getAllItems,
  getDBConnection,
  OfflineObject,
  saveRequestObject,
} from "./offline/offline-db";
import { RecordGrpuActRequst } from "./model/act_save_object_model";
import NetworkManager from "./network/network.manager";
import NetInfo from "@react-native-community/netinfo";
import { showToast } from "./components/custom.toast.message";
export default class Utils {
  static storeData = async (key: string, value: string) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      console.error(e);
    }
  };
  static clearUserData = async () => {
    try {
      this.storeData("Token", "");
      this.storeData("UserId", "");
      this.storeData("Email", "");
      this.storeData("firstName", "");
      this.storeData("lastName", "");
      //this.storeData("UserName", "");
    } catch (e) {
      console.error(e);
    }
  };
  static getData = async (key: string) => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        return value;
      }
    } catch (e) {
      console.error(e);
      return undefined;
    }
  };

  static showToastMessage(message: string) {
    Toast.show(message, Toast.LONG, {
      backgroundColor: Colors.APP_BLUE,
    });
  }

  static showToastMessageInCenter(message: string) {
    Toast.showWithGravity(message, Toast.LONG, Toast.CENTER, {
      backgroundColor: Colors.APP_BLUE,
    });
  }

  static getConvertedDate(
    dateString: string,
    inFormat: string,
    toFormat: string
  ) {
    try {
      var dateMomentObject = moment(dateString, inFormat);
      var dateObject = dateMomentObject.toDate();
      const newDate: string = moment(dateObject).format(toFormat);
      return newDate;
    } catch (e) {
      console.error(e);
      return dateString;
    }
  }
  static checkPassword(pass: string) {
    var re = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return re.test(pass);
  }
  static isValidEmail(email: string) {
    let reg =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return reg.test(email);
  }
  /**
   *
   * @param p password
   * @returns error list
   */
  static validatePassword(p: string) {
    let errors: Array<string> = [];
    const isContainsUppercase = /^(?=.*[A-Z]).*$/;
    const isContainsLowercase = /^(?=.*[a-z]).*$/;
    const isContainsNumber = /^(?=.*[0-9]).*$/;
    const isContainsSymbol =
      /^(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).*$/;

    if (p.length < 8) {
      errors.push(PASSWORD_ERROR.MIN_8);
    }
    if (!isContainsUppercase.test(p)) {
      errors.push(PASSWORD_ERROR.ONE_UP);
    }
    if (!isContainsLowercase.test(p)) {
      errors.push(PASSWORD_ERROR.ONE_LW);
    }
    if (!isContainsNumber.test(p)) {
      errors.push(PASSWORD_ERROR.ONE_NUMBER);
    }
    if (!isContainsSymbol.test(p)) {
      errors.push(PASSWORD_ERROR.ONE_SPEC);
    }
    return errors;
  }
  static getDateBefore(sourceDate: string, compareDate: string) {
    var d1 = moment(sourceDate, "MM/DD/YYYY");
    var d2 = moment(compareDate, "MM/DD/YYYY");

    //const isCheck = moment(d1).isSame(d2);
    if (moment(d1).isSame(d2)) {
      return true;
    } else if (moment(d1).isBefore(d2)) {
      return true;
    } else {
      return false;
    }
  }
  /**
   * record will save based on user logoin
   * @param url repository url
   * @param request_body request body
   */
  static async saveOfflineACTRecord(
    url: string,
    request_body: RecordGrpuActRequst
  ) {
    var userId = await Utils.getData("UserId");
    let db = await getDBConnection();
    await createRecodTable(db);

    let record: OfflineObject = {
      url: url,
      request_body: JSON.stringify(request_body),
      act_count: request_body?.acts?.length ?? 0,
      act_id: request_body.actId,
      sync_status: RECORD_STATUS.PENDING,
      user_id: Number(userId),
    };
    let result = await saveRequestObject(db, record);

    return "OFFLINE";
  }
  /**
   *
   * @param userId Rquired user id
   * @returns list of records
   */
  static async getAllOfflienACTRecords(userId: string) {
    let db = await getDBConnection();
    await createRecodTable(db);
    let allRecods = await getAllItems(db, userId ?? "", RECORD_STATUS.PENDING);

    return allRecods;
  }
  /**
   *
   * @param recordId record to delete
   * @returns record information
   */
  static async deleteRecordID(recordId: number) {
    let db = await getDBConnection();
    await createRecodTable(db);
    let reocedInfo = await deleteRecordByRecordId(db, recordId);

    return reocedInfo;
  }
  static async synchACTData(userId: string) {
    NetInfo.fetch().then(async (state) => {
      try {
        let db = await getDBConnection();
        await createRecodTable(db);
        let reocedInfo = await getAllItems(db, userId, RECORD_STATUS.PENDING);
        if (state.isConnected) {
          //TODO need write API thread
          for (let i = 0; i < reocedInfo?.length; i++) {
            let req: RecordGrpuActRequst = reocedInfo[i].request_body;
            let result = await NetworkManager.saveGroupActResults(req, true);
            if (
              result?.status?.httpStatus === 200 ||
              result?.status?.httpStatus === 400
            ) {
              //Delete Record
              let delteRec = await deleteRecordByRecordId(
                db,
                reocedInfo[i]._id
              );
            }
            if (result != undefined) {
              showToast("Offline records sync successfully!", "success");
              //this.showToastMessage("Offline records sync successfully!");
            }
          }
        } else {
          console.error("No internet connection");
        }
      } catch (e) {
        console.error(e);
      }
    });

    //return reocedInfo;
  }
}

export enum MonitorTypes {
  PENDING_ANIMAL_TASKS = 5,
  PENDING_FMTS = 9,
  PENDINGCOLLECTIONS = 203,
}

export enum ERROR_CODES {
  INVALID_JWT_TOKE = 401,
  INVALID_CREDENTIALS = 400,
}
export enum Flow {
  CHANGE = "change",
  RESET = "reset",
}
export enum PASSWORD_ERROR {
  MIN_8 = "Minimum of 8 characters.",
  ONE_UP = "At least one uppercase character.",
  ONE_LW = "At least one lowercase character.",
  ONE_NUMBER = "At least one number 0-9.",
  ONE_SPEC = "At least one special character.",
}

export enum ACT_OPERATIONS {
  RESCHEDULE = "Re-schedule",
  MARK_AS_FAILED = "Mark as Failed",
  MARK_AS_COMPLETE = "Mark as Complete",
  NOT_PERFORMED = "Not Performed",
  DELETE = "Delete",
}
export enum USER_ROLE {
  ACRT = 111,
}

export enum ACT_SCALE_TYPES {
  NUMERIC = "numericResults",
  BINARY = "binaryResults",
  SCALE = "scaleResults",
  UNDEFINED = "undefined",
}

export enum ACT_REQUEST_BODY {
  ACT_MEASUREMENT = 1,
}
export enum RECORD_STATUS {
  PENDING = "Pending",
  FAIL = "Fail",
  COMPLETED = "Completed",
}
