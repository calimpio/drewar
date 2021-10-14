import { Config } from "../../config";
import { Validation } from "../../util/validation";
import { INewUserRequestBody, IUserLoginBody, IUserUpdateBody } from "../../dto/userDTO";
import User from "src/model/user";
const ValidationTypes = Validation.ValidationTypes;
const HashTypeEnum = Config.Enum.HashTypeEnum;

export class CreateUserValidation implements Validation.IValidable<INewUserRequestBody> {

    public validations: Validation.ValidaterMap<INewUserRequestBody> = {
        email: {
            type: ValidationTypes.email,
            required: true,
        },
        username: {
            type: ValidationTypes.string,
            required: true,
            unique: () => ({
                column: "username",
                model: User
            })
        },
        name: {
            type: ValidationTypes.string,
            required: true,
        },
        lname: {
            type: ValidationTypes.string,
            required: true,
        },
        password: {
            type: ValidationTypes.string,
            required: true,
            confirm: true,
            encode: HashTypeEnum.Password,
        },
        passwordConfirm: {
            type: ValidationTypes.string,
            required: true,
        }
    }

    public props!: INewUserRequestBody
}



export class UserLoginValidation implements Validation.IValidable<IUserLoginBody>{
    validations: Validation.ValidaterMap<IUserLoginBody> = {
        username: {
            type: ValidationTypes.string,
            required: true,
        },
        password: {
            type: ValidationTypes.string,
            required: true,
            encode: HashTypeEnum.Password
        }
    }
    props!: IUserLoginBody;
}


export class UpdateUserValidation implements Validation.IValidable<IUserUpdateBody>{
    validations: Validation.ValidaterMap<IUserUpdateBody> = {
        passwords: {
            type: ValidationTypes.object,
            requiredIf: {
                condition: {
                    field: "isPasswordWillChange",
                    value: true,
                },
                then: {
                    oldPassword: {
                        type: ValidationTypes.string,
                        required: true,
                        encode: HashTypeEnum.Password,
                    },
                    newPassword: {
                        type: ValidationTypes.string,
                        required: true,
                        encode: HashTypeEnum.Password,
                    }
                }
            }
        },
        email: {
            type: ValidationTypes.email
        },
        name: {
            type: ValidationTypes.string
        },
        lname: {
            type: ValidationTypes.string
        },
        role: {
            type: ValidationTypes.number
        },
    }

    props!: IUserUpdateBody;

}