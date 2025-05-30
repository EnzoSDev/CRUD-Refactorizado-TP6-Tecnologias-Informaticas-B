const API_URL = '../../backend/server.php?module=students';

const studentAPI = 

/*

    studentAPI es un objeto, sus campos pueden tener funciones (Metodos).
    Es el encargado de consumir la API y decidir que peticiones se hacen

*/
{
    async fetchAll() 
    {
        const res = await fetch(API_URL); /* El metodo es GET por defecto */
        if (!res.ok) throw new Error("No se pudieron obtener los estudiantes");
        return await res.json();
    },

    async create(student) 
    {
        return await sendJSON('POST', student);
    },

    async update(student) 
    {
        return await sendJSON('PUT', student);
    },

    async remove(id) 
    {
        return await sendJSON('DELETE', { id });
    }
};

/* 

    La peticion se modulariza y solo con pasarle el metodo y la informacion, la funcion
    hace la peticion, convierte a JSON los datos y los pasa por el body HTTP

    Una vez que la API da una respuesta, se maneja y se devuelve algo

*/
async function sendJSON(method, data) 
{
    const res = await fetch(API_URL, 
    {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(`Error en ${method}`); /* Si hubo un error, lo lanza, en este caso no se esta manejando para mostrarlo por pantalla */
    return await res.json(); /* Convierto la respuesta JSON en un objeto JS */
}
