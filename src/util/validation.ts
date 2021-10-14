import { FindOptions, Model } from "sequelize";
import { Config } from "../config";
import { Lang } from "../config/lang";
import { ValidationPropErrorDTO, ValidationErrorDTO, ValidationErrorsCodeEnum, IValidationPropErrorDTO } from "../dto/errorMessageDTO";
import { Hash } from "./hash";


export namespace Validation {

    export namespace Exceptions {
        export interface ValidationError {
            [name: string]: string
        }
    }

    export type ValidaterMap<TData> = {
        [name: string]: IValidatorData<TData>
    }

    export class DTO {

    }

    export interface IValidable<TData> {
        validations: ValidaterMap<TData>
        props: TData | any
    }

    export type ValidDTOType<T, TData> = {
        new(data?: TData): T
    }

    export interface IValiddiableType<T, TData> extends IValidable<TData> {
        new(): T
    }

    export type IFieldModel<T extends Model> = {
        column: string,
        model: IModelValidateType<T>
    }


    export type IModelValidateType<T> = {
        findAll(options: FindOptions): Promise<T[]>
    }

    export interface IValidatorData<TData> {
        type?: ValidationTypes;
        required?: boolean;
        unique?<T extends Model>(): IFieldModel<T>;
        exists?<T extends Model>(): IFieldModel<T>;
        confirm?: {
            field: string
        } | boolean
        toClass?(): ValidDTOType<DTO, TData>;
        toValidableClass?(): ValidDTOType<DTO, TData>;
        toValidableArrayByClass?(): ValidDTOType<DTO, TData>;
        requiredIf?: {
            condition: {
                field: string,
                value: any
            },
            then: ValidaterMap<TData>
        }
        encode?: Config.Enum.HashTypeEnum,
        decode?: Config.Enum.HashTypeEnum
    }

    export enum ValidationTypes {
        none,
        string,
        number,
        email,
        object,
        array,
    }

    /**
     * 
     * @param ob 
     * @param re 
     * @throws ValidationErrorArrayDTO
     */
    export async function validate<T extends { [name: string]: any }, K extends IValidable<T>>(ob: K, re: T): Promise<K> {
        var keys = Object.keys(ob.validations);
        let doLate: (() => void)[] = [];
        ob.props = {};
        let errors: ValidationErrorDTO = new ValidationErrorDTO();
        keys.forEach((key: string) => {
            let rule = ob.validations[key];
            let value = re[key];
            ob.props[key] = value;
            if (rule) {
                const validations = (rule: IValidatorData<any>, key: string, value: any, result: any, keys: string[] = []) => {
                    keys.push(key);
                    if (value !== undefined && value !== null) {
                        if (rule.type == ValidationTypes.email) {
                            if (!validateEmail(value)) addError(errors, keys, Lang.Errors.email, ValidationErrorsCodeEnum.email)
                        } else
                            if (rule.type == ValidationTypes.string) {
                                if (typeof value !== 'string') addError(errors, keys, Lang.Errors.type("string"), ValidationErrorsCodeEnum.type)
                            } else
                                if (rule.type == ValidationTypes.number) {
                                    if (typeof value !== 'number') addError(errors, keys, Lang.Errors.type("number"), ValidationErrorsCodeEnum.type)
                                } else
                                    if (rule.type == ValidationTypes.object) {
                                        if (typeof value !== 'object') addError(errors, keys, Lang.Errors.type("object"), ValidationErrorsCodeEnum.type)
                                    } else
                                        if (rule.type == ValidationTypes.array) {
                                            if (!(value instanceof Array)) addError(errors, keys, Lang.Errors.type("array"), ValidationErrorsCodeEnum.type)
                                        }

                        if (rule.encode) {
                            result[key] = Hash.encodeByConfig(rule.encode, value);
                        }

                        if (rule.decode) {
                            result[key] = Hash.decodeByConfig(rule.decode, value);
                        }

                        let unique = rule.unique;
                        if (unique !== undefined && typeof unique == 'function') {
                            var where: any = {};
                            where[unique().column] = result[key];
                            doLate.push(async () => {
                                if (unique !== undefined) {
                                    let models = await unique().model.findAll({ where });
                                    if (models.length > 0) addError(errors, keys, Lang.Errors.unique(value), ValidationErrorsCodeEnum.unique);
                                }
                            });
                        }

                        if (rule.exists && typeof rule.exists == 'function') {
                            var where: any = {};
                            where[rule.exists().column] = result[key];
                            doLate.push(async () => {
                                if (rule.exists) {
                                    let models = await rule.exists().model.findAll({ where });
                                    if (models.length == 0) addError(errors, keys, Lang.Errors.exists(value), ValidationErrorsCodeEnum.exist);
                                }
                            });
                        }

                        if (rule.toClass && typeof value == 'object') {
                            let type = rule.toClass();
                            result[key] = Object.assign(new type(), value);
                        }

                        if (rule.toValidableClass && typeof value == 'object') {
                            let type = rule.toValidableClass();
                            doLate.push(async () => {
                                try {
                                    result[key] = await validate<any, any>(new type(), value);
                                } catch (err) {
                                    if (err instanceof ValidationErrorDTO) {
                                        errors.addError(keys.join('.'), new ValidationPropErrorDTO({ field: keys.join('.'), description: "has some error:", code: ValidationErrorsCodeEnum.toValidableClass }))
                                        errors.props[keys.join('.')] = [err.props];
                                    }
                                }
                            })
                        }

                        if (rule.toValidableArrayByClass && value instanceof Array) {
                            let type = rule.toValidableArrayByClass();
                            doLate.push(async () => {
                                let index = 0;
                                try {
                                    result[key] = (await value.map(async (vi, key) => { index = key; return await validate<any, any>(new type(), vi) }));
                                } catch (err) {
                                    if (err instanceof ValidationErrorDTO) {
                                        errors.addError(keys.join('.') + `[${index}]`, new ValidationPropErrorDTO({ field: keys.join('.') + `[${index}]`, description: "has some error:", code: ValidationErrorsCodeEnum.toValidableClass }))
                                        errors.props[keys.join('.') + `[${index}]`] = [err.props];
                                    }
                                }
                            })
                        }

                    } else {
                        if (rule.required) {
                            addError(errors, keys, Lang.Errors.required, ValidationErrorsCodeEnum.required);
                        }
                    }

                    if (rule.confirm) {
                        if (value !== (typeof rule.confirm === 'boolean' ? re[key + "Confirm"] : re[rule.confirm.field])) {
                            let keyerror = keys.splice(keys.length - 1, 1);
                            keyerror.push(typeof rule.confirm === 'boolean' ? key + "Confirm" : rule.confirm.field);
                            addError(errors, keyerror, typeof rule.confirm !== 'boolean' ?
                                Lang.Errors.confirm(key, rule.confirm.field) : Lang.Errors.confirm(key, key + "Confirm"), ValidationErrorsCodeEnum.confirm)
                        }
                    }

                    if (rule.requiredIf) {
                        if (re[rule.requiredIf.condition.field] === rule.requiredIf.condition.value && (value === undefined || value === null))
                            addError(errors, keys, Lang.Errors.requiredIf, ValidationErrorsCodeEnum.requiredIf)
                        else if (re[rule.requiredIf.condition.field] === rule.requiredIf.condition.value && value) {
                            result[rule.requiredIf.condition.field] = rule.requiredIf.condition.value;
                            Object.keys(rule.requiredIf.then).map((rkey: string) => {
                                if (rule.requiredIf) {
                                    let rule2 = rule.requiredIf.then[rkey];
                                    let value2 = re[key][rkey];
                                    result[key][rkey] = value2;
                                    validations(rule2, rkey, value2, result[key], keys.map((v) => v));
                                }
                            })
                        }
                    }
                }
                validations(rule, key, value, ob.props);
            }
        });
        for (var i in doLate) {
            await doLate[i]();
        }
        var errorsKeys = errors;
        if ((errorsKeys.hasErrors)) {
            throw errors;
        }
        return ob;
    }
}

function addError(errors: ValidationErrorDTO, key: string[], description: string, code: number) {
    errors.addError(key.join('.'), new ValidationPropErrorDTO({ field: key.join('.'), description, code }));
}
function validateEmail(value: string): boolean {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(value);
}

