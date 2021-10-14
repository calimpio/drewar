import User from "../model/user";
import PageDTO, { PageQuerys } from "../dto/PageDTO";
import Device from "../model/device";
import { Specificator } from "./specificator";
import { FindOptions } from "sequelize/types";


export interface IService<TDTO> {
    getAll: (querys: { [name: string]: string }, user?: User, models?: { [name: string]: any }, auth?: Device) => Promise<PageDTO<TDTO>>
    create: (data: TDTO, user?: User, models?: { [name: string]: any }, auth?: Device) => Promise<TDTO>
    update: (data: TDTO, user?: User, models?: { [name: string]: any }, auth?: Device) => Promise<TDTO>
    get: (user?: User, models?: { [name: string]: any }, auth?: Device) => Promise<TDTO>
    destroy: (user?: User, models?: { [name: string]: any }, auth?: Device) => Promise<any>
}

export interface IDaoToDTO<TDTO> {
    alterDTO: (data: TDTO) => void;
    toDTO: () => TDTO
}

interface Model  {
    findAndCountAll: (findOptions: FindOptions) => Promise<any>
}


export async function findAndCountAll<T>(model: Model , querys: PageQuerys, setFilter?: (filter: Specificator.IBoolRootOperator | null) => Specificator.IBoolRootOperator) {
    const filterSpec: Specificator.IBoolRootOperator | null = querys.filter ? Specificator.parse(decodeURIComponent(querys.filter)) : null;
    const findOptions: FindOptions = setFilter ? setFilter(filterSpec).toSequelizeFindOptions() : filterSpec ? filterSpec.toSequelizeFindOptions() : {};
    findOptions.order = [[querys.orderBy ? querys.orderBy : 'id', querys.order === 'ASC' ? querys.order : 'DESC']]
    findOptions.limit = isNaN(Number(querys.limit)) ? 10 : Number(querys.limit);
    findOptions.offset = (isNaN(Number(querys.offset))) ? 0 : Number(querys.offset);
    const data = (await model.findAndCountAll(findOptions)) as { rows:IDaoToDTO<T>[], count: number }
    return new PageDTO<T>(data.count, data.rows.map((dis) => dis.toDTO()));
}

/*
export default class UserAuthController<TCreate, TUpdate, TDTO> {

    service!: IModelService<TCreate, TUpdate, TDTO>
    CreateValidator!: { new(): Validation.IValidable<TCreate> };
    UpdateValidator!: { new(): Validation.IValidable<TUpdate> };

    public async getAll(req: Requests.UserAuth, res: Response) {
        try {
            const pageDto = await this.service.getAll(req.query, req.user, req.models, req.auth)
            return res.status(HTTPstatus.OK).json(pageDto)
        } catch (err) {
            if (err instanceof ErrorMessageDTO) {
                return res.status(err.status).json(err)
            }
        }
    }

    public async create(req: Requests.UserAuth, res: Response) {
        try {
            const validation = await Validation.validate(new this.CreateValidator(), req.body)
            const dto = await this.service.create(validation.props, req.user, req.models, req.auth)
            return res.status(HTTPstatus.OK).json(dto)
        } catch (err) {

        }
    }

    public async update(req: Requests.UserAuth, res: Response) {
        try {
            const validation = await Validation.validate(new this.UpdateValidator(), req.body)
            const dto = await this.service.update(validation.props, req.user, req.models, req.auth)
            return res.status(HTTPstatus.OK).json(dto)
        } catch (err) {

        }
    }

    public async get(req: Requests.UserAuth, res: Response) {
        try {
            const dto = await this.service.get(req.user, req.models, req.auth);
            return res.status(HTTPstatus.OK).json(dto)
        } catch (err) {

        }
    }

    public async destroy(req: Requests.UserAuth, res: Response) {
        try {
            const dto = await this.service.destroy(req.user, req.models, req.auth);
            return res.status(HTTPstatus.OK).json(dto)
        } catch (err) {

        }
    }
}
*/