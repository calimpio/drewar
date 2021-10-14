import { Request } from "express";
import User from "../model/user";
import Device from "../model/device";
import { INewUserRequestBody, IUserLoginBody, IUserUpdateBody } from "../dto/userDTO";
import { PageQuerys } from "../dto/PageDTO";


export namespace Requests {

    export interface ModelFinder extends Request {
        params: {
            [name: string]: string
        }
        models?: {
            [name: string]: any
        }
        auth?: Device
    }

    export interface UserAuth extends ModelFinder {
        headers: {
            authorization?: string;
        }
        user?: User
    }
    
    export interface GetAllUsers extends UserAuth {
        query: PageQuerys
    }

    export interface UserCreate extends Request {
        body: INewUserRequestBody
    }

    export interface UserLogin extends Request {
        body: IUserLoginBody
    }

    export interface UserUpdate extends UserAuth {
        body: IUserUpdateBody
    }
}