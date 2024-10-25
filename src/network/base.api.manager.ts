import axios from "axios";
import Utils from "../utils";

export const getRequest = async (urlPath: string) => {
    const res = axios
        .get(urlPath)
        .then(function (response) {
           // console.log("Response ---> ", response.data);
            return response.data;
        })
        .catch(function (error) {
            console.error("Error ---> ", error);
            return error;
        });
    return res;
};

export const getRequestWithHeaders = async (urlPath: string) => {
    var accessToken = await Utils.getData("Token");
    const res = axios
        .get(urlPath, {
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + accessToken,
            },
        })
        .then(function (response) {
           // console.log("Response ---> ", response.data);
            return response?.data;
        })
        .catch(function (error) {
            console.error("Error ---> ", error);
            return error.response?.data;
        });
    return res;
};