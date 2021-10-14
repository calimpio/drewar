import { Options } from "sequelize";
import { Sequelize } from "sequelize-typescript";
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') })


export namespace Config {

    export namespace Enum {
        export enum APIProfileEnum {
            DEV = "development",
            TEST = "test",
            PROD = "production"
        }

        export enum HashTypeEnum {
            None = "None",
            Models = "Models",
            Password = "Password"
        }
    }

    export namespace Props {
        export const APP_NAME = "Drewar";
        export const API_HEADER = "X-API-KEY";
        export const Profile = process.env.PROFILE || Enum.APIProfileEnum.DEV;
        export const IsDev = Profile == Enum.APIProfileEnum.DEV;
        
        export const HashProfiles = {
            [Enum.HashTypeEnum.Models]: {
                salt: process.env.HASH_MODELS_KEY,
                length: 32
            },
            [Enum.HashTypeEnum.Password]: {
                salt: process.env.HASH_PASSWORS_KEY,
                length: 64,
            }
        }

        export const JWT_DEVICE: Type.JWTType = {
            secret: process.env.JWT_DEVICE_KEY || "jwt_device_sec"
        }
        export const JWT_USER: Type.JWTType = {
            secret: process.env.JWT_USER_KEY || "jwt_user_sec"
        }

        export const WEB: Type.WebType = {
            port: 8000,
        }


        export const API: Type.APIType = {
            port: 8081,
            host: "localhost"
        }
    }

    //DATABASE
    const migrations = require('./migrations.js');
    const option = migrations[Props.Profile];
    option.loggin = Props.IsDev;
    export const API_DB = new Sequelize(option);      
    //DATABASE-END

    declare namespace Type {
        export type MigrationType = {
            [Enum.APIProfileEnum.DEV]: Options
            [Enum.APIProfileEnum.TEST]: Options
            [Enum.APIProfileEnum.PROD]: Options
        }
        export type JWTType = {
            readonly secret: string
        }
        export type WebType = {
            readonly port: number
        }
        export type APIType = {
            readonly port: number
            readonly host: string
        }
        export type DatabaseProfiles = {
            profiles: Map<Enum.APIProfileEnum, Options>
        }
        export type HashItem = {
            salt: string,
            length: number,
        }
        export type HashDef = Map<Enum.HashTypeEnum, HashItem>
    }
}






