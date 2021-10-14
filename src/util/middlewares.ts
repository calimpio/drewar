import { NextFunction, Response, Request } from "express";
import { Config } from "../config";
import { Requests } from "../gate/requests";
import { Hash } from "./hash";
import { js } from "./js";

interface IModel {
    findByPk: (id: number, ops?: any) => Promise<any>
}

export namespace UtilMiddlewares {
    export function getModelById<T extends IModel>(param: string, ModelDao: T, hashType: Config.Enum.HashTypeEnum = Config.Enum.HashTypeEnum.Models) {
        return async (req: Requests.ModelFinder, res: Response, next: NextFunction) => {
            try {
                if (req.params) {
                    var id = Hash.decodeByConfig(hashType, req.params[param])
                    if (!req.models) req.models = {}
                    req.models[param] = await ModelDao.findByPk(id as number, { logging: Config.Props.IsDev });
                    if (req.models[param]) {
                        next();
                        return;
                    }
                }
                return res.sendStatus(404);
            } catch (err) {
                return res.sendStatus(500);
            }
        }
    }
}