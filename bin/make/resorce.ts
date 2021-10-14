import { makeController, makeDTO, makekModel, makeValidation } from "../fnc"


(async()=>{
    await makekModel({withDTO: true});
    await makeDTO({withModel: true});
    await makeValidation();
    await makeController({withService: true, withValidation: true});
})()