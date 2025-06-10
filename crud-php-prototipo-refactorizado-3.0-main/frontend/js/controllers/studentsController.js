/**
*    File        : frontend/js/controllers/studentsController.js
*    Project     : CRUD PHP
*    Author      : Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
*    License     : http://www.gnu.org/licenses/gpl.txt  GNU GPL 3.0
*    Date        : Mayo 2025
*    Status      : Prototype
*    Iteration   : 3.0 ( prototype )
*/


/* Se importa el objeto studentsAPI que contiene las funciones para interactuar con la API de estudiantes. */
import { studentsAPI } from '../api/studentsAPI.js';

document.addEventListener('DOMContentLoaded', () => 
{
    loadStudents();
    setupFormHandler();
    setupCancelHandler();
});
  
function setupFormHandler()
{
    const form = document.getElementById('studentForm');
    form.addEventListener('submit', async e => 
    {
        e.preventDefault();
        const student = getFormData();
        const mensajeError = document.getElementById("mensajeError");
    
        try 
        {
            if (student.id) /* Si tengo id es porque estoy editando un estudiante */
            {
                await studentsAPI.update(student);
            } 
            else 
            {
                await studentsAPI.create(student);
            }
            clearForm(); /* Quito el id del campo oculto para que no se envíe en el siguiente submit */
            loadStudents();
            mensajeError.style.display = "none";
        }
        catch (err)
        {
            //console.error(err.message);
            if (err.error === "STUDENT_EXISTS")
            {
                mensajeError.textContent = "El estudiante ya existe";
                mensajeError.style.display = "block";
            }
        }
    });
}

function setupCancelHandler()
{
    /* No se resetea el formulario ya que en html el form tiene el atributo type = reset, entonces ya se hace solo, distinto es cuando yo lo vacio a mano porque ya envie datos (En clearForm) */
    const cancelBtn = document.getElementById('cancelBtn');
    cancelBtn.addEventListener('click', () => 
    {
        document.getElementById('studentId').value = '';
    });
}
  
function getFormData()
{
    return {
        /* Elimina los espacios en blanco con trim */
        id: document.getElementById('studentId').value.trim(),
        fullname: document.getElementById('fullname').value.trim(),
        email: document.getElementById('email').value.trim(),
        age: parseInt(document.getElementById('age').value.trim(), 10) /* Convierte el valor a un número entero */
    };
}
  
function clearForm()
{
    document.getElementById('studentForm').reset();
    document.getElementById('studentId').value = '';
}
  
async function loadStudents()
{
    try 
    {
        const students = await studentsAPI.fetchAll();

        /*

        students es de este tipo:
        [
            { 
                id: 1, 
                fullname: 'Juan Perez', 
                email: 'juanperez@gmail.com', 
                age: 20 
            },
            { id: 2, fullname: 'Ana Gomez', email: 'anagomez@gmail.com', age: 22 },
        ]
        Es un array de objetos, cada objeto representa un estudiante con sus propiedades: id, fullname, email y age.
        
        */
        renderStudentTable(students);
    } 
    catch (err) 
    {
        console.error('Error cargando estudiantes:', err.message);
    }
}
  
function renderStudentTable(students)
{
    const tbody = document.getElementById('studentTableBody');
    tbody.replaceChildren(); /* Se elimina todo el contenido del tbody para que no se repitan los estudiantes al recargar la tabla */
  
    students.forEach(student => 
    {
        /*

        Por cada estudiante, se crea una fila (tr) y se añaden celdas (td) con sus datos. 
        Ademas se crea una celda para las acciones (editar y borrar) que se añaden al final de la fila.
        Luego añado la fila al tbody de la tabla.
        El añadir las celdas o la fila se hace con el método appendChild, que añade un nodo al final de la lista de hijos de un nodo padre.

        */
        const tr = document.createElement('tr');
    
        tr.appendChild(createCell(student.fullname));
        tr.appendChild(createCell(student.email));
        tr.appendChild(createCell(student.age.toString()));
        tr.appendChild(createActionsCell(student));
    
        tbody.appendChild(tr);
    });
}
  
function createCell(text)
{
    const td = document.createElement('td');
    td.textContent = text; /* Uso textContent en lugar de innerHTML para evitar inyecciones de código */
    return td;
}
  
function createActionsCell(student)
{
    const td = document.createElement('td');
  
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Editar';
    editBtn.className = 'w3-button w3-blue w3-small';
    editBtn.addEventListener('click', () => fillForm(student));

    /*

    ¿Por qué al hacer clic en "Editar" se llenan los datos correctos en el formulario?

    Cuando se crea la tabla, para cada estudiante se genera un botón "Editar" y se le asigna un manejador de evento:
        editBtn.addEventListener('click', () => fillForm(student));

    Gracias a los closures en JavaScript, cada función flecha "recuerda" el valor de la variable student correspondiente
    a esa iteración del bucle. Así, aunque el renderizado de la tabla ya haya terminado, cuando se hace clic en un botón,
    la función asociada tiene acceso al estudiante correcto y pasa sus datos a fillForm.

    Esto no es algo propio de los eventos, sino una característica del lenguaje JavaScript: las funciones creadas dentro
    de un bucle pueden acceder a las variables de ese contexto en el que fueron creadas, incluso después de que el bucle terminó.
    */
  
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Borrar';
    deleteBtn.className = 'w3-button w3-red w3-small w3-margin-left';
    deleteBtn.addEventListener('click', () => confirmDelete(student.id));
  
    td.appendChild(editBtn);
    td.appendChild(deleteBtn);
    return td;
}
  
function fillForm(student)
{
    document.getElementById('studentId').value = student.id;
    document.getElementById('fullname').value = student.fullname;
    document.getElementById('email').value = student.email;
    document.getElementById('age').value = student.age;
}
  
async function confirmDelete(id) 
{
    const mensajeError = document.getElementById("mensajeError");
    /* Si se presiona en el boton de cancelar del modal de confirmación, no se hace nada, ya que confirm devuelve falso y con el ! es verdadero por lo que hace el return y sale */
    if (!confirm('¿Estás seguro que deseas borrar este estudiante?')) return;
  
    try 
    {
        await studentsAPI.remove(id);
        mensajeError.style.display = "none";
        loadStudents();
    } 
    catch (err) 
    {
        if(err.error === "STUDENT_IN_USE"){
            mensajeError.textContent = "El estudiante no se puede borrar porque tiene materias asignadas";
            mensajeError.style.display = "block";
        }
    }
}
