import { create } from "domain";
import { NextFunction, Request, Response } from "express";
import { Config } from "../../config";
import { Requests } from "../requests";
import jwt from 'jsonwebtoken'
import Device from "../../model/device";
import { DeviceType, IDeviceDTO } from "../../dto/deviceDTO";
import { UserService } from "../../service/userService";
import { Hash } from "../../util/hash";
import { DeviceService } from "../../service/deviceService";
import { HTTPstatus } from "../../dto/errorMessageDTO";
import { UserRole } from "../../dto/userDTO";


export namespace DeviceController {
    export namespace Middleware {
        export function ApiKey(haveTo?: (device: Device) => boolean) {
            return async (req: Requests.ModelFinder, res: Response, next: NextFunction) => {
                const apiHeaderToken = req.header(Config.Props.API_HEADER)               
                if (apiHeaderToken) {
                    let doLate!: () => Promise<Response<any, Record<string, any>> | undefined>;
                    jwt.verify(apiHeaderToken, Config.Props.JWT_DEVICE.secret, (err, device) => {
                        doLate = async () => {
                            if (!err) {
                                let deviceDTO = device as IDeviceDTO;
                                let find = await Device.findAll({ where: { name: deviceDTO.name } });
                                if (find.length > 0) {
                                    if (haveTo) if (!haveTo(find[0])) return;
                                    req.auth = find[0];
                                    next();
                                    return;
                                }
                                return res.sendStatus(404);
                            }
                            return res.sendStatus(401);
                        }
                    })
                    return await doLate();
                }
                return res.sendStatus(401);
            }
        }
    }

    export async function init(req: Request, res: Response) {
        try {
            await UserService.createWithRole({
                name: "superadmin",
                username: "superadmin",
                password: Hash.encodePassword("123456"),
                email: "example@web.com",
                lname: "superAdmin",
            }, UserRole.SUPER)

            await DeviceService.create({
                name: "web",
                type: DeviceType.WEB,
            })

            await DeviceService.create({
                name: "api",
                type: DeviceType.APP,
            })

            return res.sendStatus(HTTPstatus.OK);
        } catch (err) {
            return res.sendStatus(HTTPstatus.NOT_FOUND)
        }
    }    
}