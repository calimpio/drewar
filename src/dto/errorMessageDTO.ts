export enum HTTPstatus {
    OK = 200,
    BAD_REQUEST = 400,
    FORBIDDEN = 403,
    SERVER_ERROR = 500,
    NOT_FOUND = 404
}

export enum ValidationErrorsCodeEnum {
    required,
    unique,
    exist,
    type,
    confirm,
    toClass,
    toValidableClass,
    requiredIf,
    badCredentials,
    email,
    notsame,
}

export interface IErrorMessageDTO {
    title: string;
    origin: string;
    description: string;
    status: number;
    errors?: any;
}

export interface IValidationPropErrorDTO {
    field: string
    description: string
    code: ValidationErrorsCodeEnum
}

export default class ErrorMessageDTO implements IErrorMessageDTO {
    public title: string;
    public origin: string;
    public description: string;
    public status: number;
    public errors: any;
    constructor(data: IErrorMessageDTO) {
        this.title = data.title;
        this.origin = data.origin;
        this.description = data.description;
        this.errors = data.errors;
        this.status = data.status;
    }
}

export class ValidationPropErrorDTO implements IValidationPropErrorDTO {
    public field: string
    public description: string
    public code: ValidationErrorsCodeEnum
    constructor(data: IValidationPropErrorDTO) {
        this.field = data.field;
        this.description = data.description;
        this.code = data.code;
    }
}

export class ValidationErrorDTO {
    type = "validationError"
    hasErrors!: boolean
    props!: {
        [name: string]:  IValidationPropErrorDTO[] | any[]
    }

    constructor(data?: any) {
        this.props = data ? data.props : {};
    }

    addError(key: string, value: IValidationPropErrorDTO) {
        this.hasErrors = true;
        if (!this.props) this.props = {};
        if (!this.props[key]) this.props[key] = [];
        this.props[key].push(value);
        return this;
    }
}

