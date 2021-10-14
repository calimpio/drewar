import { UtilMiddlewares } from "../util/middlewares";
import { UserController } from "../gate/controller/userController";
import { DeviceController } from "../gate/controller/deviceController";

export namespace Middlewares {
    export const UserAuth = UserController.MiddleWare.userAuth;
    export const FindById = UtilMiddlewares.getModelById;
    export const ApiKey = DeviceController.Middleware.ApiKey;
}