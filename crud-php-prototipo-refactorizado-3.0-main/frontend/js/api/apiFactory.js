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
    /* Si config.urlOverride esta definido uso su valor, sino usa la url de la derecha */
    const API_URL = config.urlOverride ?? `../../backend/server.php?module=${moduleName}`;

    async function sendJSON(method, data)
    {
        const res = await fetch(API_URL,
        {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        let json;
        try {
            json = await res.json();
        } catch (e) {
            json = {};
        }

        if (!res.ok) throw json;
        return json;
    }

    return {
        async fetchAll()
        {
            /* Por defecto la peticion se hace con GET */
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
            /* Se oasa {id} o {id : id} ya que JSON.stringify recibe un objeto JS, no un entero por ejemplo, por eso le paso un objeto para que pueda convertirlo a JSON */
            return await sendJSON('DELETE', { id });
        }
    };
}
