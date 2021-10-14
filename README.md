# SERVIALL API
It is a project created for Camilo Barbosa to create a strong web!
using for backend: `Express js` `Sequelize` `Typescript` `Nodejs`

## Install

clone this repo:
`$git clone https://github.com/calimpio/drewar` 

Install node modules
`$npm i`

Generate `.env`
`$node bin/generate`

## Run
- dev mode:
`$npm run start:dev`
- build a dist:
`$npm run build`
- frontend compile:
`npm run watch`

## Documentation

1. Backend
    1. Configuration
    2. Models & DAOS
    3. Services & DTOS
    5. Gates
        1. Controllers
        2. Requests
        3. Validations
    6. Routes
        1. Middlewares
        2. Api
        3. Web
    
        
## Comandos
- ### Comando para crear un `Model`
    `$ npm run make:model` `[modelName][:["withDTO"]<optional>]` `[prop1]=[type]` `[...props]`
    - ex: `$ npm run make:model Service description=string`.

        Crea un modelo `Service` con la propiedad `descripcion` de tipo `string`

    - ex: `$ npm run make:model Service:withDTO description=string`
        
        Crea un modelo `Service` importando a un `ServiceDTO` con la propiedad `descripcion` de tipo `string`

-  ### Comando para crear un `DTO`
    `$ npm run make:dto` `[dtoName][:[withModel]<optional>]` `[prop1]=[type]` `[...props]`
    - ex: `$ npm run make:dto MyService description=string`.

        Crea un dto `Myervice` con la propiedad `descripcion` de tipo `string`

    - ex: `$ npm run make:dto MyService:withModel description=string`
        
        Crea un dto `MyService` implementando un `IDTOtoDao<IServiceDTO>` con la propiedad `descripcion` de tipo `string`

-  ### Comando para crear un `(Model, Service, DTO, Validation y Controller)`
    `$ npm run make:resource` `[modelName]` `[prop1]=[type]` `[...props]`
    - ex: `$ npm run make:resource MyResource description=string`.

        Crea todo el recurso para el modelo `MyResource`    
