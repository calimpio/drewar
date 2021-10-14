import { IDeviceDTO } from "../dto/deviceDTO";
import jwt from "jsonwebtoken"
import { Config } from "../config";
import Device from "../model/device";

export namespace DeviceService {

    export function sign(device: IDeviceDTO, options?: jwt.SignOptions) {
        return jwt.sign({ name: device.name, type: device.type }, Config.Props.JWT_DEVICE.secret, options)
    }

    export async function create(deviceDTO: IDeviceDTO) {
        return (await Device.create({
            name: deviceDTO.name,
            type: deviceDTO.type
        }, { logging: Config.Props.IsDev })).toDTO();
    }

    export async function signWeb() {
        var web = await Device.findOne({ where: { name: "web" } })
        var webDTO = web ? web.toDTO() : null;
        return webDTO ? sign(webDTO) : null;
    }
}