const SS_API_URL = '../../backend/server.php?module=studentsSubjects';

const studentsSubjectsAPI = 
{
    async fetchAll() 
    {
        const res = await fetch(SS_API_URL);
        if (!res.ok) throw new Error("No se pudo obtener la relación");
        return await res.json();
    },

    /* Uso entry como nombre del parametro */

    async create(entry) 
    {
        return await sendSSJSON('POST', entry);
    },

    async update(entry) 
    {
        return await sendSSJSON('PUT', entry);
    },

    async remove(id) 
    {
        return await sendSSJSON('DELETE', { id });
    }
};

async function sendSSJSON(method, data) 
{
    const res = await fetch(SS_API_URL, 
    {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(`Error en ${method}`);
    return await res.json();
}
