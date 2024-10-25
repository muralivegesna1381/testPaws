import * as apiConstant from "./api.constants";
import { getRequest } from "./base.api.manager";


const LoadBowlAPIManager = {

    updateSessionStatus: async (data: any) => {
        let result = await getRequest(
            apiConstant.BASE_URL_BOWL_DETAILS + apiConstant.UPDATE_SESSION_STATUS_URL + JSON.stringify(data)
        );
        return result;
    },

    getSessionBowlsLoaded: async (data: any) => {
        let result = await getRequest(
            apiConstant.BASE_URL_BOWL_DETAILS + apiConstant.GET_SESSION_BOWLS_LOADED + data
        );
        return result;
    },

    getSessionDetail: async (data: any) => {
        let result = await getRequest(
            apiConstant.BASE_URL_BOWL_DETAILS + apiConstant.GET_SESSION_DETAIL + data
        );
        return result;
    },

    getfeedingAnimalSessions: async (data: any) => {
        let result = await getRequest(
            apiConstant.BASE_URL_BOWL_DETAILS + apiConstant.GET_ANIMAL_SESSION_DETAIL + data
        );
        return result;
    },

    setLoadBowlDetails: async (data: any) => {
        let result = await getRequest(
            apiConstant.BASE_URL_BOWL_DETAILS + apiConstant.SET_LOAD_BOWL_DETAILS + data
        );
        return result;
    },

    getBowlDetails: async (data: any) => {
        let result = await getRequest(
            apiConstant.BASE_URL_BOWL_DETAILS + apiConstant.GET_CAGE_FEEDER_DETAILS + data
        );
        return result;
    },
};

export default LoadBowlAPIManager;