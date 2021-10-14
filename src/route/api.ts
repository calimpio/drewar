import { Router } from 'express';
import { DeviceController } from '../gate/controller/deviceController';
import User from '../model/user';
import { UserController } from '../gate/controller/userController';
import { Middlewares } from './middlewares';
import { UserRole } from 'src/dto/userDTO';


//import { Config } from '../config';
//const HashType = Config.Enum.HashTypeEnum;

// public-routes
const api = Router();
const apiPublic = Router();
api.use(apiPublic)
{
    apiPublic.post("/init", DeviceController.init)    
}

// private-routes
const apiPrivate = Router();
api.use(apiPrivate);
apiPrivate.use(Middlewares.ApiKey())
{
    // user-routes
    const user = Router();
    apiPrivate.use('/users', user);
    {
        user.post("/", UserController.create)
        user.post("/login", UserController.login)
        //User-auth-routes
        const userAuth = Router();
        user.use(userAuth);
        userAuth.use(Middlewares.UserAuth())
        {
            userAuth.get("/", UserController.getAll)
            userAuth.get("/:user", Middlewares.FindById("user", User), UserController.get)
            userAuth.put("/:user", Middlewares.FindById("user", User), UserController.update)
            userAuth.delete("/:user", Middlewares.FindById("user", User), UserController.destroy)
        }        
    }    
}


export default api;