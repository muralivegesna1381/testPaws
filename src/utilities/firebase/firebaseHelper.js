import analytics from '@react-native-firebase/analytics';
//import * as Constant from "../../utils/constants/constant";
//import * as DataStorageLocal from "../../utils/storage/dataStorageLocal";
import Utils from "./../../utils";

let isAnalyticsEnabled = true;

/////////////////////////// Screens //////////////////////////
export const Screen_Loadbowl_Home = 'Screen_Loadbowl_Home';
export const Screen_Loadbowl_Scan = 'Screen_Loadbowl_Scan';
export const Screen_Loadbowl_SessionList = 'Screen_Loadbowl_SessionList';
export const Screen_Loadbowl_SessionDetails = 'Screen_Loadbowl_SessionDetails';
export const Screen_Audit_Log = 'Screen_Audit_Log';
export const Screen_More_Info = 'Screen_More_Info';
export const Screen_My_Profile = 'Screen_My_Profile';
export const Screen_Change_Password = 'Screen_Change_Password';
export const Screen_Settings = 'Screen_Settings';
export const Screen_Room_User_Monitor = 'Screen_Room_User_Monitor';
export const Screen_Room_Preference = 'Screen_Room_Preference';

export const Screen_Login = 'Screen_Login';
export const Screen_Dashboard_Grid = 'Screen_Dashboard_Grid';
export const Screen_Dashboard_List = 'Screen_Dashboard_List';
export const Screen_Animals = 'Screen_Animals';
export const Screen_ACT_List = 'Screen_ACT_List';
export const Screen_Notifications = 'Screen_Notifications';
export const Screen_Notes = 'Screen_Notes';
export const Screen_Measurements = 'Screen_Measurements';
export const Screen_Tasks = 'Screen_Tasks';
export const Screen_Submit_Tasks = 'Screen_Submit_Tasksubmit';
export const Screen_Update_DVC = 'Screen_Update_DVC';
export const Screen_DVC_Help = 'Screen_DVC_Help';


export const Event_Loadbowl_Button_Home = 'Event_Loadbowl_Button_Home';
export const Event_Scanbowl_Button_Home = 'Event_Scanbowl_Button_Home';
export const Event_Loadbowl_Button_Tab = 'Event_Loadbowl_Button_Tab';
export const Event_Scanbowl_Button_Tab = 'Event_Scanbowl_Button_Tab';
export const Event_Loadbowl_Button_Scan = 'Event_Loadbowl_Button_Scan';
export const Event_Scanbowl_Button_Scan = 'Event_Scanbowl_Button_Scan';
export const Event_Loadbowl_Button_Submit = 'Event_Loadbowl_Button_Submit';
export const Event_Loadbowl_Button_Reset = 'Event_Loadbowl_Button_Reset';
export const Event_Loadbowl_Button_SessionList = 'Event_Loadbowl_Button_SessionList';
export const Event_Loadbowl_Button_SessionDetail = 'Event_Loadbowl_Button_SessionDetail';
export const Event_Scan_Barcode = 'Event_Scan_Barcode';
export const Event_Scan_FeederId = 'Event_Scan_FeederId';
export const Event_Submit_Bowl_Success = 'Event_Submit_Bowl_Success';
export const Event_Submit_Bowl_Fail = 'Event_Submit_Bowl_Fail';
export const Event_Update_Session = 'Event_Update_Session';
export const Event_Get_Bowl_Details = 'Event_Get_Bowl_Details';
export const Event_Get_Bowl_Details_Success = 'Event_Get_Bowl_Details_Success';
export const Event_Get_Bowl_Details_Fail = 'Event_Get_Bowl_Details_Fail';
export const Event_Update_Session_Success = 'Event_Update_Session_Success';
export const Event_Update_Session_Fail = 'Event_Update_Session_Fail';
export const Event_Update_Session_ListPage = 'Event_Update_Session_ListPage';

export const Event_Audit_Log_Button = 'Event_Audit_Log_Button';
export const Event_Audit_Log_Search = 'Event_Audit_Log_Search';
export const Event_Audit_Log_Filter = 'Event_Audit_Log_Filter';
export const Event_Audit_Log_Reset = 'Event_Audit_Log_Reset';
export const Event_Audit_Log_Entity_Type_Filter = 'Event_Audit_Log_Entity_Type_Filter';
export const Event_Audit_Log_Entity_Filter = 'Event_Audit_Log_Entity_Filter';
export const Event_Audit_Log_Date_Filter = 'Event_Audit_Log_Date_Filter';
export const Event_Audit_Log_User_Filter = 'Event_Audit_Log_User_Filter';
export const Event_Audit_Log_Export_CSV = 'Event_Audit_Log_Export_CSV';
export const Event_Audit_Log_Export_CSV_Success = 'Event_Audit_Log_Export_CSV_Success';
export const Event_Audit_Log_Export_CSV_Fail = 'Event_Audit_Log_Export_CSV_Fail';

export const Event_Change_Password_Button = 'Event_Change_Password_Button';
export const Event_Room_User_Monitor_Button = 'Event_Room_User_Monitor_Button';
export const Event_My_Profile_Button = 'Event_My_Profile_Button';
export const Event_Settings_Button = 'Event_Settings_Button';
export const Event_Data_Sync_Button = 'Event_Data_Sync_Button';
export const Event_Logout = 'Event_Logout';
export const Event_Room_Prefrences_Button = 'Event_Room_Prefrences_Button';


export const Event_Change_Password_Submit = 'Event_Change_Password_Submit';
export const Event_Login_Button = 'Event_Login_Button';
export const Event_Login_Sucess = 'Event_Login_Sucess';
export const Event_Login_Fail = 'Event_Login_Fail';
export const Event_Change_Password_Success = 'Event_Change_Password_Success';
export const Event_Change_Password_Fail = 'Event_Change_Password_Fail';
export const Event_FaceID_On = 'Event_FaceID_On';
export const Event_FaceID_Off = 'Event_FaceID_Off';


export const Event_Search_By_Animal = 'Event_Search_By_Animal_Tab';
export const Event_Search_By_Location = 'Event_Search_By_Location_Tab';
export const Event_Record_Group_Act = 'Event_Record_Group_Act';
export const Event_Record_Group_Act_Next = 'Event_Record_Group_Act_Next';
export const Event_Select_Animal = 'Event_Select_Animal';
export const Event_Select_Location = 'Event_Select_Location';
export const Event_Search_Animal = 'Event_Search_Animal';
export const Event_Search_Location = 'Event_Search_Location';


export const Event_ACT_Measurement = 'Event_ACT_Measurement_Tab';
export const Event_ACT_Tasks = 'Event_ACT_Tasks_Tab';
export const Event_Select_Measurement_ACT = 'Event_Select_Measurement_ACT';
export const Event_Select_Task_ACT = 'Event_Select_Task_ACT';
export const Event_Select_RGA_Measurement_ACT = 'Event_Select_RGA_Measurement_ACT';
export const Event_Select_RGA_Task_ACT = 'Event_Select_RGA_Task_ACT';

export const Event_Select_Room_Tab = 'Event_Select_Room_Tab';
export const Event_Select_User_Tab = 'Event_Select_User_Tab';

export const Event_Notifications = 'Event_Notifications';
export const Event_Notes = 'Event_Notes';
export const Event_GridView = 'Event_GridView';
export const Event_ListView = 'Event_ListView';

export const Event_ACT_Dashboard = 'Event_ACT_Dashboard';
export const Event_FMT_Dashboard = 'Event_FMT_Dashboard';
export const Event_Pending_Collections_Dashboard = 'Event_Pending_Collections_Dashboard';

export const Event_Pending_Tasks = 'Event_Pending_Tasks';
export const Event_Completed_Tasks = 'Event_Completed_Tasks';

export const Event_ACT_DropDown = 'Event_ACT_Dashboard';
export const Event_FMT_DropDown = 'Event_FMT_Dashboard';
export const Event_Pending_Collections_DropDown = 'Event_Pending_Collections_DropDown';

export const Event_Select_Location_Dashboard = 'Event_Select_Location_Dashboard';

export const Event_Select_Animal_Dashboard = 'Event_Select_Animal_Dashboard';

export const Event_ACT_Reset_Filter = 'Event_ACT_Reset_Filter';
export const Event_ACT_Apply_Filter = 'Event_ACT_Apply_Filter';
export const Event_Collections_Reset_Filter = 'Event_Collections_Reset_Filter';
export const Event_Collections_Apply_Filter = 'Event_Collections_Apply_Filter';
export const Event_FMT_Reset_Filter = 'Event_ACT_Reset_Filter';
export const Event_FMT_Apply_Filter = 'Event_ACT_Apply_Filter';

export const Event_Notifications_Read_All = 'Event_Notificatios_Read_All';
export const Event_Notifications_Delete_All = 'Event_Notifications_Delete_All';
export const Event_Notification_Delete = 'Event_Notification_Delete';
export const Event_Notification_Read = 'Event_Notification_Read';
export const Event_Speech_Notes = 'Event_Speech_Notes';
export const Event_Notes_Submit = 'Event_Notes_Submit';
export const Event_Delete_Notes = 'Event_Delete_Notes';

export const Event_Submit_Measurements = 'Event_Submit_Measurements';
export const Event_Delete_ACT_Measurements = 'Event_Delete_ACT_Measurements';
export const Event_ReSchdule_ACT_Measurements = 'Event_ReSchdule_ACT_Measurements';
export const Event_Mark_as_Failed_ACT_Measurements = 'Event_Mark_as_Failed_ACT_Measurements';
export const Event_Not_Performed_ACT_Measurements = 'Event_Not_Performed_ACT_Measurements';
export const Event_UpdateDVC_Button = 'Event_UpdateDVC_Button';
export const Event_Select_DVC = 'Event_Select_DVC';
export const Event_DVC_Help = 'Event_DVC_Help';
export const Event_Speech_Mark_as_Faild = 'Event_Speech_Mark_as_Faild';
export const Event_Speech_Mark_as_Complete = 'Event_Speech_Mark_as_Complete';
export const Event_Speech_Not_Performed = 'Event_Speech_Not_Performed';

export const Event_Delete_ACT_Tasks = 'Event_Delete_ACT_Tasks';
export const Event_ReSchdule_ACT_Tasks = 'Event_ReSchdule_ACT_Tasks';
export const Event_ReSchdule_Mark_as_Complete_RGA = 'Event_ReSchdule_Mark_as_Complete_RGA';
export const Event_ReSchdule_Mark_as_Complete = 'Event_ReSchdule_Mark_as_Complete';
export const Event_Mark_as_Failed_ACT_Tasks = 'Event_Mark_as_Failed_ACT_Tasks';
export const Event_Not_Performed_ACT_Tasks = 'Event_Not_Performed_ACT_Tasks';
export const Event_Cancel_Room_Preference = 'Event_Cancel_Room_Preference';
export const Event_Submit_Room_Preference = 'Event_Submit_Room_Preference';

export const Event_Change_Password = 'Event_Change_Password';


export async function setUserId(userId) {
    if (isAnalyticsEnabled) {
        await analytics().setUserId(userId)
    }
}

export async function setUserProperty(email) {
    if (isAnalyticsEnabled) {
        await analytics().setUserProperty("email", email);
    }
}

export async function reportScreen(screen_name) {
    if (isAnalyticsEnabled) {
        await analytics().logScreenView({
            screen_name: screen_name,
            screen_class: screen_name,
        });
    }
}

export async function logEvent(eventName, screenName, description, more_info) {
    if (isAnalyticsEnabled) {
        var moreInputs = ""
        if (more_info != undefined) {
            moreInputs = moreInputs + "" + more_info
        }
        var email = await Utils.getData("Email") ?? "";
        if (email != "") {
            moreInputs = `Email: ` + email + ' ' + moreInputs
        }
        let parms = {
            "screenName": screenName,
            "description": description,
            "more_info": moreInputs
        }
        await analytics().logEvent(eventName, parms)
    }
}