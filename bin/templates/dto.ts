import { MakeOptions } from "../types";

export const templateDTO = (model: string, props: string[], options: MakeOptions = { }) =>
    `${options.withModel?`import { IDaoToDTO } from "../util/services";`:""}
export interface I${model}DTO {
    id?: string;
${props.reduce((ac, data) => {
        const prop = data.split('=');
        return ac + `\t${prop[0]}: ${prop[1]};\n`;
    },"")}
    createdAt?: string;
    updatedAt?: string;
}

export class ${model}DTO implements I${model}DTO {
    id?: string;
${props.reduce((ac,data) => {
        const prop = data.split('=');
        return ac + `\t${prop[0]}!: ${prop[1]};\n`
    }, "")}
    createdAt?: string;
    updatedAt?: string;
    constructor(data: ${options.withModel?`IDaoToDTO<I${model}DTO> |`:""} I${model}DTO) {
        ${options.withModel ? `if (data) {
            let dao = (data as IDaoToDTO<I${model}DTO>);
            let dto = (data as I${model}DTO);
            if (typeof dao.alterDTO == "function")
                dao.alterDTO(this)
            else {
                this.id = dto.id;
${props.reduce((ac, data) => {
        const prop = data.split('=');
        return ac + `\t\t\t\tthis.${prop[0]} = dto.${prop[0]};\n`
    },"")}
                this.createdAt = dto.createdAt;
                this.updatedAt = dto.updatedAt;
            }
        }`: `this.id = data.id;
${props.reduce((ac, data) => {
        const prop = data.split('=');
        return ac +`\t\tthis.${prop[0]} = data.${prop[0]};\n`
    },"")}
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;`}
    }
}
`