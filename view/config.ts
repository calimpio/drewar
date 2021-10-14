import axios from 'axios'
import {IUserDTO, UserDTO, UserRole } from '../src/dto/userDTO';
import AppRouter from './router';
import { UserService } from './service/userService';

export namespace Config {

    export namespace Routes {
        export const Login = "/login";
        export const ForgetPassword = `${Login}/forgetpassword`;
        export const Register = "/register";
        export const Dashboard = "/dashboard";              
    }

    export const APP_NAME = document.head.querySelector('title').text;
    
    function getPrivateMetaData(name: string) {
        let element = document.head.querySelector(`meta[name=${name}]`)
        if (element) {
            let data = (element as HTMLMetaElement).content;
            document.head.removeChild(element);
            return data;
        }
    }
    const API_TOKEN = getPrivateMetaData("csrf-token");
    const API_HOST = getPrivateMetaData("apihost");

    export const API_PRIVATE_AXIOS = axios.create({
        baseURL: `http://${API_HOST}`,
        headers: {
            "X-API-KEY": API_TOKEN,
            "Accept": "application/json"
        }
    });

    export const API_PRUBLIC_AXIOS = axios.create({
        baseURL: `http://${API_HOST}`,
        headers: {
            "Accept": "application/json"
        }
    });

    export namespace Auth {
        let user!: IUserDTO;
        let token!: string;
        let userid!: string;
        let noLoadeduserEvents: ((user: UserDTO) => void)[] = [];

        function downloadUser(noLoaded?: (user: UserDTO) => void) {
            if (token) {
                UserService.get(userid).then((iuser) => {
                    user = iuser;
                    let userd = new UserDTO(user);
                    noLoaded(userd);
                    noLoadeduserEvents.forEach((event) => {
                        event(userd);
                    })
                    noLoadeduserEvents = [];
                }).catch((err) => {
                    if (err.status == 500) {
                        //todo
                    }
                })
            }
        }

        export function isAuth(noLoaded?: (user: UserDTO) => void) {
            if (!user) {
                token = localStorage.getItem('x-drewar-token');
                userid = localStorage.getItem('x-drewar-user');
                downloadUser(noLoaded);
            }
            return !!user || typeof token == 'string';
        }

        export function getUser(noLoaded?: (user: UserDTO) => void) {
            if (!user && token) {
                if (noLoaded)
                    noLoadeduserEvents.push(noLoaded);
            }
            if (user)
                return new UserDTO(user);
        }

        export function getUserId() {
            return userid;
        }

        export function getApi() {
            if (token) {
                let headers = API_PRIVATE_AXIOS.defaults.headers;
                headers["Authorization"] = "barrer " + token;
                API_PRIVATE_AXIOS.defaults.headers = headers;
                return API_PRIVATE_AXIOS;
            } else {
                let headers = API_PRIVATE_AXIOS.defaults.headers;
                headers["Authorization"] = "barrer ";
                API_PRIVATE_AXIOS.defaults.headers = headers;
            }
        }

        export function setUser(iuser: IUserDTO, saveSession?: boolean) {
            user = iuser;
            if (user) {
                token = user.token;
                userid = user.id;
            }
            if (user && saveSession) {
                localStorage.setItem('x-drewar-user', user.id);
                localStorage.setItem('x-drewar-token', user.token);
            } else {
                localStorage.clear();
            }
            AppRouter.app.forceUpdate();
        }
    }

}