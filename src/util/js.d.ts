export namespace js {
    const utiljs: js = require('./js');
    export namespace Functions {
        export const regexSpesificator: (specStr: string, comparators: { [cmp: string]: string }) => RegExpMatchArray[]
            = utiljs.Functions.regexSpesificator;        
    }
}




