import { IDeviceDTO } from "./deviceDTO";

export enum UserRole {
    GUEST,
    ADMIN,
    SUPER,
}

export interface IUserDTO {
    id: string
    email: string;
    username: string,
    name: string;
    lname: string;
    createdAt: string;
    updatedAt: string;
    role: UserRole,
    token?: string,
    apikeys?: IDeviceDTO[]    
}

export interface IUserLoginBody {
    username: string,
    password: string,
}

export interface IUserRolerBody {
    username: string,
    role: UserRole,
}

export interface INewUserRequestBody extends IUserLoginBody {
    email: string,
    name: string,
    lname: string,
    passwordConfirm?: string
}


export interface IUserUpdateBody {
    isPasswordWillChange?: boolean,
    passwords?: {
        oldPassword: string,
        newPassword: string,
    },
    email?: string
    name?: string
    lname?: string
    role?: UserRole
}

export interface IUserDao {
    alterDTO(data: IUserDTO): void
}

export class UserDTO implements IUserDTO {
    public id!: string
    public email!: string;
    public name!: string;
    public lname!: string;
    public username!: string;
    public role!: UserRole
    public token!: string
    public createdAt!: string;
    public updatedAt!: string;
    public apikeys!: IDeviceDTO[]

    constructor(data?: IUserDao | any) {
        if (data) {
            let userDao: IUserDao = data;
            if ('function' == typeof userDao.alterDTO) {
                userDao.alterDTO(this);
            } else {
                this.id = data.id;
                this.email = data.email;
                this.name = data.name;
                this.username = data.username;
                this.lname = data.lname;
                this.role = data.role;
                this.createdAt = data.createdAt;
                this.updatedAt = data.updatedAt;
            }
        }
    }

    public static fromList(users: any[]): UserDTO[] {
        return users.map((u) => new UserDTO(u));
    }
}




