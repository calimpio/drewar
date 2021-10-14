<!-- docfast-js-api-doc -->
# Mecapp API Rest Documentation

- ## User
   `http://mecapp:8081/api` Operar datos del Usuario.
   |Método|Ruta|Auth?|Descripción|
   |----|----|----|----|
   |**post**|[/auth/user](#post-authuser)|No|Iniciar sesion como Usuario.|
   |**post**|[/users](#post-users)|No|Registrar nuevo usuario.|
   |**get**|[/users](#get-users)|Si|Obtener informacion del usuario y la compañia.|


- ## Rutas

   - ##### `post` /auth/user
      **Descripción:** Iniciar sesion como Usuario.
**Tags:** [User](#user) [API](#api)

      - **Respuesta**

         - `201` Usuario a iniciado sesion.

            - `application/json`
               **Ejemplo:**
               ```json
               {
                 "user": { "id": 21321, "email": "me@example.ocm", "create_at": "20-254-000" },
                 "token": "akslkdláskldkalskdlkasld´kaslkd´laskdasdkasjdklñjaksjdkasdjkañsjdlkj"
               }
               ```
   - ##### `post` /users
      **Descripción:** Registrar nuevo usuario.
**Tags:** [User](#user) [API](#api)

      - **Parámetros**

         - **Cabeceras**
            |Nombre|Tipo|
            |----|----|
            |**X-API-KEY**|*string*|

         - **Datos**
            |Nombre|Tipo|Descripción|Reglas|
            |----|----|----|----|
            |**email**|*string*|Correo del usuario.|Requerido.|
            |**password**|*string*|Contraseña del usuario.|Requerido.|
            |**passwordConfirmed**|*string*|Contraseña confirmada del usuario.|requrido|

         - **En: body, query**
      - **Respuesta**

         - `201` Usuraio creado

            - `application/json`
               **Ejemplo:**
               ```json
               { "token": "akslkdláskldkalskdlkasld´kaslkd´laskdasdkasjdklñjaksjdkasdjkañsjdlkj" }
               ```
         - `401` `X-API-KEY` no es valida.

   - ##### `get` /users
      **Descripción:** Obtener informacion del usuario y la compañia.
**Tags:** [User](#user) [API](#api)

      - **Parámetros**

         - **Cabeceras**
            |Nombre|Tipo|
            |----|----|
            |**Authorization**|*string*|
            |**X-API-KEY**|*string*|

      - **Respuesta**

         - `200` Usuario y su compañia.

            - `application/json`
               **Ejemplo:**
               ```json
               { "id": 21321, "email": "me@example.ocm", "create_at": "20-254-000" }
               ```
         - `401` `X-API-KEY` no es valida.

         - `421` El token de sesion a expirado.

- ## Modelos

- ### UserStoreResponse
   **Tipo:** *object*
   |Nombre|Tipo|Descripción|
   |----|----|----|
   |**token**|*string*| |

- ### UserLoginResponse
   **Tipo:** *object*
   |Nombre|Tipo|Descripción|
   |----|----|----|
   |**user**|*object*| |
   |**token**|*string*| |

   - ### user
      **Tipo:** *object*
      |Nombre|Tipo|Descripción|
      |----|----|----|
      |**id**|*number*| |
      |**email**|*string*| |
      |**create_at**|*string*| |

- ### InvalidResponse
   **Tipo:** *object*
   |Nombre|Tipo|Descripción|
   |----|----|----|
   |**message**|*string*| |
   |**errors**|*object*| |

   - ### errors
      **Tipo:** *object*
      |Nombre|Tipo|Descripción|
      |----|----|----|
      |**mail**|*string*| |
      |**password**|*string*| |
      |**passwordConfirmed**|*string*| |

- ### Unauthorizate
   **Tipo:** *object*
   |Nombre|Tipo|Descripción|
   |----|----|----|
   |**message**|*string*| |

- ### Data
**Tipo:** *enum*
**Datos:**  *XK*, *YX*, *ZX*




<!-- /docfast-js-api-doc -->