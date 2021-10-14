import { Types } from "./types";


type QueryOrder = "ASC" | "DESC"

export type  PageQuerys = {
    filter?: Types.Specificator.SpecEncodedURIComponentString,
    offset?: string,
    order?: QueryOrder,
    orderBy?: string,
    limit?: string,
}



export default class PageDTO<T> {
    public count: number;
    public items: T[];

    constructor(count: number, items: T[]){
        this.count = count;
        this.items = items;
    }
}