export namespace Lang {
    export namespace Errors {
        export const required = "field is required.";
        export const unique = (value: any)=>`${value} allredy exists.`;
        export const exists = (value: any) => `${value} is not exists.`;
        export const confirm = (field: string, other: any) => `${field} is not the same as ${other}.`;
        export const email = `ìs not a email address.`;
        export const requiredIf = `field is required.`;
        export const type = (type: any) => `is not a instance of ${type.name}.`;
    }
}

