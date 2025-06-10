const SUBJECT_API_URL = '../../backend/server.php?module=subjects';

const subjectAPI = 
{
    async fetchAll() 
    {
        const res = await fetch(SUBJECT_API_URL);
        if (!res.ok) throw new Error("No se pudieron obtener las materias");
        return await res.json();
    },

    async create(subject) 
    {
        return await sendSubjectJSON('POST', subject);
    },

    async update(subject) 
    {
        return await sendSubjectJSON('PUT', subject);
    },

    async remove(id) 
    {
        return await sendSubjectJSON('DELETE', { id });
    }
};

async function sendSubjectJSON(method, data) 
{
    const res = await fetch(SUBJECT_API_URL, 
    {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(`Error en ${method}`);
    return await res.json();
}
