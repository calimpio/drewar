
import { DeviceDTO, DeviceType, IDeviceDao, IDeviceDTO } from "../dto/deviceDTO";
import { Config } from "../config";
import { Hash } from "../util/hash";
import { Optional } from "sequelize";
import { Column, Model, PrimaryKey, Table } from "sequelize-typescript";


interface IDevice {
    id: bigint,
    name: string,
    type: DeviceType,
    createdAt?: string,
    updatedAt?: string,
}

interface DeviceCreationAttributes extends Optional<IDevice, "id">, Omit<IDevice, "id"> { }

@Table({ tableName: "devices" })
export default class Device extends Model<IDevice, DeviceCreationAttributes> implements IDevice, IDeviceDao, IDevice {
    @PrimaryKey
    @Column
    public id!: bigint;

    @Column
    public name!: string;

    @Column
    public type!: DeviceType;
    
    alterDTO(data: IDeviceDTO): void {
        data.id = Hash.encodeId(this.get("id"));
        data.name = this.get("name");
        data.type = this.get("type");
        data.createdAt = this.get("createdAt");
        data.updatedAt = this.get("updatedAt");
    }

    
    toDTO() {
        return new DeviceDTO(this);
    }

    
}

Config.API_DB.addModels([Device])
