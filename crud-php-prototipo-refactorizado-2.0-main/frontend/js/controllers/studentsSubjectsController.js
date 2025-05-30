document.addEventListener('DOMContentLoaded', () => 
{
    initSelects();
    setupFormHandler();
    loadRelations();
});

async function initSelects() 
{
    try 
    {
        // Cargar estudiantes
        const students = await studentAPI.fetchAll(); /* Obtengo todos los estudiantes */
        const studentSelect = document.getElementById('studentIdSelect'); /* Obtengo el select de estudiantes */
        students.forEach(s => 
        {
            const option = document.createElement('option'); /* Creo una opcion para cada elemento del arreglo */
            option.value = s.id; /* El valor es el id de la BD */
            option.textContent = s.fullname;
            studentSelect.appendChild(option);
        });

        // Cargar materias
        /* Repito el proceso de students pero con subjects */
        const subjects = await subjectAPI.fetchAll();
        const subjectSelect = document.getElementById('subjectIdSelect');
        subjects.forEach(sub => 
        {
            const option = document.createElement('option');
            option.value = sub.id;
            option.textContent = sub.name;
            subjectSelect.appendChild(option);
        });
    } 
    catch (err) 
    {
        console.error('Error cargando estudiantes o materias:', err.message);
    }
}

function setupFormHandler() 
{
    const form = document.getElementById('relationForm'); /* Obtengo formulario */
    form.addEventListener('submit', async e => 
    {
        e.preventDefault(); /* Evito que se recargue la pagina */

        const relation = getFormData(); /* Genero un objeto o un registro en C con los datos */

        try 
        {
            if (relation.id) /* El id aca seria un campo oculto para saber el id de la relacion en la tabla de la BD */
            {
                await studentsSubjectsAPI.update(relation);
            } 
            else 
            {
                await studentsSubjectsAPI.create(relation);
            }
            clearForm();
            loadRelations();
        } 
        catch (err) 
        {
            console.error('Error guardando relación:', err.message);
        }
    });
}

/* 

    ############### IMPORTANTE ################## 
    El value del select es el value del option seleccionado, por eso funciona
    student_id: document.getElementById('studentIdSelect').value,
    subject_id: document.getElementById('subjectIdSelect').value,

    Sino seleccione ninguna es UNDEFINED

*/

function getFormData() 
{
    return{ /* Forma de retornar un objeto, usando {}, en lugar de crear un objeto auxiliar */
        id: document.getElementById('relationId').value.trim(),
        student_id: document.getElementById('studentIdSelect').value, /* Al usar el .value accedo al value del option seleccionado */
        subject_id: document.getElementById('subjectIdSelect').value,
        approved: document.getElementById('approved').checked ? 1 : 0 /* Si esta en true, le pongo 1 sino 0 */

        /*

            approved es el checkbox, con checked accedo al valor del checkbox (True o false)
            La base de datos no tiene un booleano, tiene un 1 o un 0
            Por eso le asigno 1 o 0 dependiendo del valor del checkbox
            Al recibir los datos del backend, el valor de approved es un string "0" o "1".
            El backend los tiene en string porque al recibirlos desde la base de datos con fetch_assoc se reciben en un arreglo asociativo y son un campo string. Todos los datos son strings.
            Por eso lo convierto a un número real con Number(approved)

        */
    };
}

function clearForm() 
{
    document.getElementById('relationForm').reset();
    document.getElementById('relationId').value = '';
}

async function loadRelations()
{
    try 
    {
        const relations = await studentsSubjectsAPI.fetchAll();

        /*

            Esto devuelve un arreglo de objetos, cada objeto tiene los siguientes campos:

            [
                {
                    id: "1",
                    student_id: "1",
                    subject_id: "1",
                    approved: "1",
                    student_fullname: "Ana García",
                    subject_name: "Matemática"
                },
                {
                    id: "2",
                    student_id: "2",
                    subject_id: "2",
                    approved: "0",
                    student_fullname: "Luis Pérez",
                    subject_name: "Historia"
                }
            ]

        */
        
        /**
         * DEBUG
         */
        console.log(relations);

        /**
         * En JavaScript: Cualquier string que no esté vacío ("") es considerado truthy (Verdadero).
         * Entonces "0" (que es el valor que llega desde el backend) es truthy,
         * ¡aunque conceptualmente sea falso! por eso: 
         * Se necesita convertir ese string "0" a un número real 
         * o asegurarte de comparar el valor exactamente. 
         * Con el siguiente código se convierten todos los string approved a enteros.
         */
        relations.forEach(rel => 
        {
            rel.approved = Number(rel.approved);
        });

        console.log("Luego de la conversion", relations);
        
        renderRelationsTable(relations);
    } 
    catch (err) 
    {
        console.error('Error cargando inscripciones:', err.message);
    }
}

function renderRelationsTable(relations) 
{
    const tbody = document.getElementById('relationTableBody'); /* Obtengo el cuerpo de la tabla */
    tbody.replaceChildren();

    relations.forEach(rel => 
    {
        const tr = document.createElement('tr');

        // tr.appendChild(createCell(rel.fullname || rel.student_id));old
        tr.appendChild(createCell(rel.student_fullname));
        // tr.appendChild(createCell(rel.name || rel.subject_id));old
        tr.appendChild(createCell(rel.subject_name));
        tr.appendChild(createCell(rel.approved ? 'Sí' : 'No'));
        tr.appendChild(createActionsCell(rel));

        tbody.appendChild(tr);
    });
}

function createCell(text) 
{
    const td = document.createElement('td');
    td.textContent = text;
    return td;
}

function createActionsCell(relation) 
{
    const td = document.createElement('td');

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Editar';
    editBtn.className = 'w3-button w3-blue w3-small';
    editBtn.addEventListener('click', () => fillForm(relation));

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Borrar';
    deleteBtn.className = 'w3-button w3-red w3-small w3-margin-left';
    deleteBtn.addEventListener('click', () => confirmDelete(relation.id));

    td.appendChild(editBtn);
    td.appendChild(deleteBtn);
    return td;
}

function fillForm(relation) 
{
    document.getElementById('relationId').value = relation.id;
    document.getElementById('studentIdSelect').value = relation.student_id;
    document.getElementById('subjectIdSelect').value = relation.subject_id;
    document.getElementById('approved').checked = !!relation.approved; 
    /*

        El !! sirve para convertir el 1 o 0 a un booleano
        Si approved es 1, !!relation.approved es true
        Si approved es 0, !!relation.approved es false
        Esto se logra ya que !1 es false y !0 es true
        Si tengo !1 es false, y si le pongo otro !, se convierte en true
        (Esto es ya que 1 seria true, pero el checked acepta solo booleanos)

    */
}

async function confirmDelete(id) 
{
    if (!confirm('¿Estás seguro que deseas borrar esta inscripción?')) return;

    try 
    {
        await studentsSubjectsAPI.remove(id);
        loadRelations();
    } 
    catch (err) 
    {
        console.error('Error al borrar inscripción:', err.message);
    }
}
