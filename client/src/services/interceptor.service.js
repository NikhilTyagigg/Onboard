import axios from "axios";
import LocalStorageService from './localstorage.service';
import { config } from '../configs'
import { apiURL } from '../configs'
import { Message } from "../utility/constants/message";

const localStorageService = LocalStorageService.getService();

export const axiosInstance = axios.create({
  baseURL: config.baseURL,
  headers: {
    "Content-Type": "application/json"
  }
});

axiosInstance.interceptors.request.use(
    config=>{
        const token = localStorageService.getAccessToken();
        if (token) {
            config.headers['Authorization'] = 'Bearer ' + token;
        }
        return config;
    }, error => {
        Promise.reject(error)
    }
);

axiosInstance.interceptors.response.use((response) => {
        return response
    }, 
    function(error){
        const originalRequest = error.config;
        if(error && error.response &&  error.response.status === 401 && !originalRequest._retry){
            originalRequest._retry = true;
            const refreshToken = localStorageService.getRefreshToken();
            var headers = {
                //Authorization: 'Bearer ' + refreshToken,
                // refresh: refreshToken
                'Content-type': 'application/json'
            }

            return axios({
              method: 'post',
              url: apiURL.LOGIN_REFRESH_TOKEN,
              data: {
                'refresh': refreshToken
              },
              headers: headers
            }).then(response=>{
                if(response.status === 200){
                    localStorageService.setTokenAfterRefreshToken(response.data.access);
                    axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.access;                    
                    originalRequest.headers.Authorization = 'Bearer ' + response.data.access;
                    return axios(originalRequest);
                }
            }).catch(error=>{
                localStorageService.clearToken();
                localStorageService.clearLocalStorage();
                window.location = '/';
            });
        }

        return Promise.reject(handleError(error));
    }
);

const handleError = (error) => {
    const returnErrorResponse = {status: 'Failed', message: 'Oops!!! Something went wrong at our end. Please try again after a minute'};
    if(error?.response?.data?.detail != undefined){
        returnErrorResponse.status  = error.response.data?.status ? error.response?.data?.status : null;
        if(error.response.data.detail == "PLAN_EXPIRED"){
            returnErrorResponse.message = Message.PLAN_EXPIRED;
        }else if(error.response.data.detail == "ALL_CREDITS_USED"){
            returnErrorResponse.message =  Message.ALL_CREDITS_USED
        }else{
            returnErrorResponse.message = error.response.data.detail;
        }
    }else if(error?.response?.data?.error?.message != undefined){
        returnErrorResponse.status  = error.response?.data?.status ? error.response.data.status : null;
        returnErrorResponse.message = error.response.data?.error?.message;
    }else if(error?.response?.data?.message != undefined){
        returnErrorResponse.status  = error.response.data.status ? error.response.data.status : null;
        returnErrorResponse.message = error.response.data.message;
    }else if(error?.response?.data != undefined){
        returnErrorResponse.status  = error.response.data.status ? error.response.data.status : null;
        returnErrorResponse.message = jsonToString(error.response.data);
    }else if((error?.name === 'Error' || error?.name === "AxiosError") && error?.message === "Network Error"){
        //localStorageService.clearToken();
        //localStorageService.clearLocalStorage();
        
    }

    return returnErrorResponse;
}

const jsonToString = (data) => {
    if(typeof data == "object"){
        const keys = Object.keys(data);
        const message = [];
        if(keys && keys.length > 0){
            keys.forEach(keyName=>{
                message.push(data[keyName])
            })
        }
        return message.join('\n');
    }

    return data;
    
    
}

