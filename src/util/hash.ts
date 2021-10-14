import HashId from 'hashids'
import { Config } from '../config'
const modules = Config.Props.HashProfiles[Config.Enum.HashTypeEnum.Models]
const password = Config.Props.HashProfiles[Config.Enum.HashTypeEnum.Password]

export namespace Hash {
    export function encodeId(id: number | bigint ){
        let hashId = new HashId(modules.salt, modules.length )
        return hashId.encode(id);
    }

    export function decodeId(id: string){
        const hashids = new HashId(modules.salt, modules.length);
        var list = hashids.decode(id);
        return list.length > 0 ? list[0] : 0;
    }

    export function encodePassword(psd: string) {
        const hashids = new HashId(password.salt, password.length);
        return hashids.encodeHex(psd);
    }   

    export function encodeByConfig(config: Config.Enum.HashTypeEnum | undefined, value: any){
        if(config == Config.Enum.HashTypeEnum.Models){
           return Hash.encodeId(value);
        }
        if(config == Config.Enum.HashTypeEnum.Password){
            return Hash.encodePassword(value);
        }
        return value;
    }

    export function decodeByConfig(config: Config.Enum.HashTypeEnum | undefined, value: any){
        if(config == Config.Enum.HashTypeEnum.Models){
           return Hash.decodeId(value);
        }       
        return value;
    }
}