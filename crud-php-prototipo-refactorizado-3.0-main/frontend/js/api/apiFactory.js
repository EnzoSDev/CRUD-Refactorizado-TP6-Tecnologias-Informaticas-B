/**
*    File        : frontend/js/api/apiFactory.js
*    Project     : CRUD PHP
*    Author      : Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
*    License     : http://www.gnu.org/licenses/gpl.txt  GNU GPL 3.0
*    Date        : Mayo 2025
*    Status      : Prototype
*    Iteration   : 3.0 ( prototype )
*/

export function createAPI(moduleName, config = {})  /* Config es un objeto opcional que permite añadir cambios si se requieren */
/* Se usa export function para exportar la función createAPI, que se encuentra en el archivo apiFactory.js. */
{
    const API_URL = config.urlOverride ?? `../../backend/server.php?module=${moduleName}`;

    /*

        Si config tiene el atributo urlOverride, se utiliza ese valor como URL de la API.
        Si no, se utiliza la URL por defecto que es ../../backend/server.php?module=moduleName.
        Esto permite que se pueda cambiar la URL de la API si se requiere, sin necesidad de modificar el código de la función createAPI.
        Por ejemplo, si se quiere utilizar una URL diferente para el módulo 'students', se puede

        ?? Es el operador de coalescencia nula, que devuelve el operando de la izquierda si no es null o undefined, y el operando de la derecha en caso contrario.

    */

    async function sendJSON(method, data) 
    {
        const res = await fetch(API_URL,
        {
            method,
            headers: { 'Content-Type': 'application/json' }, /* Se indica lo que se esta enviando al servidor */
            body: JSON.stringify(data)
        });

        if (!res.ok) throw new Error(`Error en ${method}`);
        return await res.json();
    }

    return { /* La funcion createAPI devuelve un objeto con las funciones que se pueden utilizar para interactuar con la API */
        async fetchAll()
        {
            const res = await fetch(API_URL);
            if (!res.ok) throw new Error("No se pudieron obtener los datos");
            return await res.json();
        },
        async create(data)
        {
            return await sendJSON('POST', data);
        },
        async update(data)
        {
            return await sendJSON('PUT', data);
        },
        async remove(id)
        {
            return await sendJSON('DELETE', { id });
        }
    };
}
