export function map(source: any, target: any){
    Object.keys(target).map(key=>{
        target[key] = source[key];
    })
    return target;
}