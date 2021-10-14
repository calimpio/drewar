import { Request, Response, Router } from 'express';
import path from 'path';
import { Config } from '../config';
import { DeviceService } from '../service/deviceService';

// Export the base-router
const web = Router();
const staticDir = path.join(__dirname, '../public');

web.get('/**', async (req: Request, res: Response) => {
    let apitoken = await DeviceService.signWeb();
    if (apitoken) {
        let api = `${Config.Props.API.host}:${Config.Props.API.port}`
        let apihost = `${api}/api`
        let statics = `${api}/public`
        return res.render("index", { apitoken, apihost, statics, app_name: Config.Props.APP_NAME })
    }
    return res.status(404).send("not found");
})

export default web;
