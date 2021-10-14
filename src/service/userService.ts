import { FindOptions, Op } from "sequelize";
import User, { IUser } from "../model/user";
import ErrorMessageDTO, { ValidationErrorDTO, ValidationErrorsCodeEnum, ValidationPropErrorDTO } from "../dto/errorMessageDTO";
import PageDTO, { PageQuerys } from "../dto/PageDTO";
import { Specificator } from "../util/specificator";
import { INewUserRequestBody, IUserDTO, IUserRolerBody, UserDTO, UserRole } from "../dto/userDTO";
import { UserLoginValidation, UpdateUserValidation } from "../gate/validation/userValidation"
import { Config } from "../config";
import jwt from 'jsonwebtoken'
import { Hash } from "../util/hash";
import { DeviceService } from "./deviceService";
import Device from "../model/device";
import { DeviceType } from "../dto/deviceDTO";
import { findAndCountAll} from "src/util/services";


export namespace UserService {

    export async function login(user: UserLoginValidation) {
        try {
            let value = await User.findAll({ where: user.props });
            if (value.length > 0) {
                if (!value[0].get("deleted")) {
                    var userDTO = value[0].toDTO()
                    userDTO.token = sign(userDTO);
                    if (userDTO.role >= UserRole.SUPER) {
                        userDTO.apikeys = (await Device.findAll({
                            where: { type: { [Op.ne]: DeviceType.WEB } },
                            logging: Config.Props.IsDev
                        })).map((device) => {
                            var deviceDTO = device.toDTO();
                            deviceDTO.token = DeviceService.sign(deviceDTO);
                            return deviceDTO;
                        })
                    }
                    return userDTO;
                }
            }
        } catch (err) {
            throw new ErrorMessageDTO({ title: "Error at creating user.", origin: "API User Logger", description: "Internal server error", status: 500, errors: (Config.Props.IsDev ? err : null) });
        }
        throw new ErrorMessageDTO({ title: "Error at login user.", origin: "API User Logger", description: "Bad credentials", errors:{type:"BadCredentials"}, status: 400 })
    }

    export async function createWithRole(params: INewUserRequestBody, role: UserRole) {
        return (await User.create({
            name: params.name,
            lname: params.lname,
            username: params.username,
            password: params.password,
            role: role,
            email: params.email,
        })).toDTO();
    }

    export async function create(userStore: INewUserRequestBody) {
        try {
            var user = await _create(userStore);
            afterCreated(user);
            let userDTO = user.toDTO()
            return userDTO;
        } catch (err) {
            throw new ErrorMessageDTO({ title: "Error at creating user.", origin: "API User Creator", description: "Internal server error", status: 500, errors: (Config.Props.IsDev ? err : null) });
        }
    }

    export async function createAndLogin(userStore: INewUserRequestBody) {
        try {
            var user = await _create(userStore);
            afterCreated(user);
            let userDTO = user.toDTO()
            userDTO.token = sign(userDTO);
            return userDTO;
        } catch (err) {
            throw new ErrorMessageDTO({ title: "Error at creating user.", origin: "API User Creator", description: "Internal server error", status: 500, errors: (Config.Props.IsDev ? err : null) });
        }
    }

    export async function getAll(querys: PageQuerys) {
        try {
            return await findAndCountAll<IUserDTO>(User, querys, (filter)=>{
                return Specificator.where(Specificator.no<IUser>("deleted", true)).and(filter);
            })
        }
        catch (err) {
            console.log(err);            
            throw new ErrorMessageDTO({ title: "Error at creating user.", origin: "API User Finder", description: "Internal server error", status: 500, errors: (Config.Props.IsDev ? err : null) });
        }
    }

    export async function update(user: User, userUpdateDTO: UpdateUserValidation, userAuth: User) {
        let data = userUpdateDTO.props;
        let willUpdate = false;
        if (userAuth.get('role') == UserRole.ADMIN) {
            if (data.role) {
                user.set('role', data.role);
                willUpdate = true;
            }
        } else if (user.get('id') == userAuth.get('id')) {

            if (data.email) {
                user.set('email', data.email);
                willUpdate = true;
            }
            if (data.name) {
                user.set("name", data.name);
                willUpdate = true;
            }
            if (data.lname) {
                user.set("lname", data.lname);
                willUpdate = true;
            }

            if (data.passwords && data.isPasswordWillChange) {
                let passData = data.passwords;
                if (passData.oldPassword !== user.get('password')) {
                    throw new ValidationErrorDTO().addError("passwords.oldPassword", new ValidationPropErrorDTO({ field: "passwords.oldPassword", description: "Bad credential.", code: ValidationErrorsCodeEnum.badCredentials }))
                } else if (passData.newPassword == user.get('password')) {
                    throw new ValidationErrorDTO().addError("passwords.oldPassword", new ValidationPropErrorDTO({ field: "passwords.oldPassword", description: "passwords.newpassword is the oldpassword.", code: ValidationErrorsCodeEnum.notsame }))
                }
                user.set('password', passData.newPassword);
                willUpdate = true;
            }
            if (willUpdate) {
                user = await user.save({ logging: Config.Props.IsDev });
            }

        }
        if (willUpdate) {
            user = await user.save({ logging: Config.Props.IsDev });
        }
        return user.toDTO()
    }

    export async function destroy(user: User) {
        user.set("deleted", true);
        return Hash.encodeId((await user.save()).get('id'))
    }


    async function _create(newUser: INewUserRequestBody) {
        var userCreated!: User;
        let data = await User.findAll({ where: { deleted: true }, limit: 1 });
        if (data.length > 0) {
            userCreated = data[0];
            userCreated.set("username", newUser.username);
            userCreated.set("password", newUser.password);
            userCreated.set("name", newUser.name);
            userCreated.set("email", newUser.email);
            userCreated.set("role", UserRole.GUEST);
            userCreated.set("deleted", false);
            return await userCreated.save({ logging: Config.Props.IsDev });
        }
        return await User.create({
            username: newUser.username,
            password: newUser.password,
            name: newUser.name,
            lname: newUser.lname,
            email: newUser.email,
            role: UserRole.GUEST,
        }, { logging: Config.Props.IsDev })
    }

    function afterCreated(user: User) {

    }

    function sign(user: IUserRolerBody) {
        return jwt.sign({ username: user.username, role: user.role }, Config.Props.JWT_USER.secret)
    }


}





