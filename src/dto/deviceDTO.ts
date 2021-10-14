export enum DeviceType {
    WEB,
    APP
}

export interface IDeviceDTO {
    id?: string;
    name: string;
    createdAt?: string;
    updatedAt?: string;
    type: DeviceType;
    token?: string;
}

export interface IDeviceDao {
    alterDTO(data: IDeviceDTO): void
}

export class DeviceDTO implements IDeviceDTO {
    public id!: string;
    public name!: string;
    public createdAt!: string;
    public updatedAt!: string;
    public type!: DeviceType;
    public token?: string | undefined;
    
    constructor(data: IDeviceDao) {
        data.alterDTO(this);
    }
}