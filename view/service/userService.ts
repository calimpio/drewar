import { ServerResponse } from "http";
import { Config } from "../config";

import ErrorMessageDTO, {} from '../../src/dto/errorMessageDTO';
import { IUserDTO, IUserLoginBody } from "../../src/dto/userDTO";
import { AuthService } from "./authService";

export namespace UserService {
    export async function sign(user: IUserLoginBody, saveSession: boolean) {        
        try {
            const response = await Config.API_PRIVATE_AXIOS.post('/users/login', user);
            if (response.status == 200) {
                Config.Auth.setUser(response.data as IUserDTO, saveSession);
                return Config.Auth.getUser();
            }
        } catch (err) {
           if(err.response){               
               throw new ErrorMessageDTO(err.response.data)           
           }
        }        
    }

    export async function get(id: string) {       
        try {
            const response = await AuthService.get<IUserDTO>(`/users/${id}`);             
            if (response.status == 200) {
                return response.data;
            }
        } catch (err) {
            if(err.response){               
                throw new ErrorMessageDTO(err.response.data)           
            }
        }
    }
}