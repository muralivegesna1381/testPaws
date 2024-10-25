import * as apiConstant from "./api.constants";
import { getRequestWithHeaders } from "./base.api.manager";


const prepareAuditREquestUrl = async (
    startDate: string,
    endDate: string,
    entityTypeId: any,
    entity: any,
    user: any
) => {
    let requestUrl = "";
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
    return requestUrl;
}

const AuditLogAPIManager = {

    getLookUpUsers: async () => {
        // type 1: - all list of Users note - * Typeahead
        // type 2: - List of PerformedBy Users note - * Dropdown
        let url = apiConstant.BASE_URL + apiConstant.LOOKUP_USERS + "/" + 2;
        let dvcs = await getRequestWithHeaders(url);
        return dvcs;
    },

    getAuditEntityTypes: async () => {
        let url = apiConstant.BASE_URL + apiConstant.AUDIT_ENTITY_TYPES;
        let result = await getRequestWithHeaders(url);
        return result;
    },

    getAuditEntity: async () => {
        let url = apiConstant.BASE_URL + apiConstant.AUDIT_ENTITY;
        let result = await getRequestWithHeaders(url);
        return result;
    },

    getAuditDetailsList: async (
        startDate: any,
        endDate: any,
        entityTypeId: any,
        entity: any,
        user: any
    ) => {
        let requestUrl = apiConstant.BASE_URL + apiConstant.AUDIT_DETAILS;
        let preparedRequest = await prepareAuditREquestUrl(startDate,
            endDate,
            entityTypeId,
            entity,
            user);
        requestUrl = requestUrl + preparedRequest;
        let result = await getRequestWithHeaders(
            requestUrl
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
        let requestUrl = apiConstant.BASE_URL + apiConstant.EXPORT_AUDIT_DETAILS + loginUserId;
        let preparedRequest = await prepareAuditREquestUrl(startDate,
            endDate,
            entityTypeId,
            entity,
            user);
        requestUrl = requestUrl + preparedRequest;
        let result = await getRequestWithHeaders(
            requestUrl
        );
        return result;
    },
};

export default AuditLogAPIManager;
