import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { Config } from "../config";

export namespace AuthService {

    function forbidden(err: { response?: AxiosResponse }, method:keyof AxiosInstance, url: string, config?: AxiosRequestConfig, data?:any) {
        if(err.response && err.response.status == 403){
            Config.Auth.setUser(null);
        }
        throw err;
    }


    export async function get<T>(url: string, config?: AxiosRequestConfig) {
        try {
            return await Config.Auth.getApi().get<T, AxiosResponse<T>>(url, config);
        } catch (err) {
            forbidden(err,"get", url, config);
        }
    }

    export async function post<T>(url: string, data: any, config?: AxiosRequestConfig) {
        try {
            return await  Config.Auth.getApi().post<T, AxiosResponse<T>>(url, data, config);
        } catch (err) {
            forbidden(err, "post", url, config, data);
        }
    }


    export async function put<T>(url: string, data: any, config?: AxiosRequestConfig) {
        try {
            return await Config.Auth.getApi().put<T, AxiosResponse<T>>(url, data, config);
        } catch (err) {
            forbidden(err, "put", url, config, data);
        }
    }


    export async function del<T>(url: string, config?: AxiosRequestConfig) {
        try {
            return await  Config.Auth.getApi().delete<T, AxiosResponse<T>>(url, config);
        } catch (err) {
            forbidden(err, "delete", url, config);
        }
    }
}