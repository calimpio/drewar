import { MakeOptions } from "../types";

export const templateValidation = (model: string, props: string[], options: MakeOptions)=>
`import { ${model}DTO } from "../../dto/${model.toLowerCase()}DTO";
import { Validation } from "../../util/validation";
const ValidationTypes = Validation.ValidationTypes;

export class Create${model}Validation implements Validation.IValidable<${model}DTO>{
    validations: Validation.ValidaterMap<${model}DTO> = {
${props.reduce((ac,data) => {
            const prop = data.split('=');
            return ac + `\t\t${prop[0]}: {\n\t\t\ttype: ValidationTypes.${prop[1]}\n\t\t},\n`
        },"")}
    }
    props!: DisciplineDTO;

}

export class Update${model}Validation implements Validation.IValidable<${model}DTO>{
    validations: Validation.ValidaterMap<${model}DTO> = {
${props.reduce((ac,data) => {
            const prop = data.split('=');
            return ac + `\t\t${prop[0]}: {\n\t\t\ttype: ValidationTypes.${prop[1]}\n\t\t},\n`
        },"")}
    }
    props!: DisciplineDTO;

}
`