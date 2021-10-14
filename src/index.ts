import {appAPI, appWEB} from './Server';
import { Config } from './config';




const portAPI = Config.Props.API.port;
const portWEB = Config.Props.WEB;
appAPI.listen(portAPI, () => {
    if (Config.Props.IsDev)
        console.log(Config.Props.APP_NAME);
});

appWEB.listen(portWEB,()=>{
    if (Config.Props.IsDev)
        console.log("web");
})
