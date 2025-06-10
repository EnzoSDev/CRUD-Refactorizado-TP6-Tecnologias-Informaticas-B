document.addEventListener('DOMContentLoaded', () => 
{
    loadStudents();
    setupFormHandler();
});

/*

    Espera a que el DOM este cargado y ejectua dos funciones

    ¿Que es el DOM (Document Object Model)?

     El DOM es una representación estructurada en forma de árbol de un documento HTML o XML. Permite que Javascript acceda y manipule el contenido, la estructura y los estilos de una página web.
     Javascript utiliza el DOM para interactuar con los elementos de una página. Cada elemento HTML se convierte en un objeto en el DOM, accesible a través de Javascript.

     Elemento: Un componente individual en un documento HTML (ej: <div>, <p>, <a>). En el DOM, se representa como un objeto.

    Atributo: Una propiedad que proporciona información adicional sobre un elemento (ej: id, class, src). Se accede a ellos a través de propiedades del objeto del elemento en el DOM.

    Nodo: Un término genérico para cualquier objeto en el árbol del DOM. Los elementos, atributos y texto son todos tipos de nodos.

*/
  
function setupFormHandler() /* Manejador del formulario de students.html */
{
    const form = document.getElementById('studentForm'); /* Obtiene el formulario por el id */
    form.addEventListener('submit', async e => 
    /* 
    
        Al presionar en el boton que haga submit, se ejecuta una funcion asincrona flecha 
        con un parametro e (eventObject, se declara por defecto para manipular propiedades del
        evento)

    */
    {
        e.preventDefault(); /* Evito que se recargue la pagina */
        const student = getFormData(); /* Obtengo los datos del estudiante */
    
        try 
        {
            if (student.id) /* Si el estudiante existe */
            {
            await studentAPI.update(student); 
            /* 

                Uso la variable studentAPI (Es un objeto) y accedo a una de 
                sus funciones (uptadte en este caso) 
                
                En JS un objeto tiene metodos, campos que son funciones

            */
            } 
            else 
            {
            await studentAPI.create(student); /* Sino existe creo al estudiante */
            }
            clearForm(); /* Limpio el formulario */
            loadStudents(); /* Vuelvo a cargar la tabla */
        }
        catch (err)
        {
            console.error(err.message);
        }
    });
}
  
function getFormData()
{
    return {
        id: document.getElementById('studentId').value.trim(), /* Quita los espacios al principio y al final (Ej: "   hola mundo   " -> "hola mundo") */
        fullname: document.getElementById('fullname').value.trim(),
        email: document.getElementById('email').value.trim(),
        age: parseInt(document.getElementById('age').value.trim(), 10) /* Convierto el string a int en base decimal (10) */
    };
}
  
function clearForm()
{
    document.getElementById('studentForm').reset(); /* LImpia todos los campos del formulario */
    document.getElementById('studentId').value = ''; /* Deja esto vacio por si se vuelve a crear un estudiante (Despues de actualizar uno por ejemplo) */
}
  
async function loadStudents()
{
    try 
    {
        const students = await studentAPI.fetchAll(); 
        /* 
        
            Obtengo todos los datos
            [
                {
                    id: "1",
                    fullname: "Ana García",
                    email: "ana@gmail.com",
                    age: 21
                },
                {
                    id: "2",
                    fullname: "Luis Pérez",
                    email: "luis@gmail.com",
                    age: 23
                }
            ]
 
            
        */
        renderStudentTable(students); /* Paso el objeto JS con los estudiantes para renderizar la tabla */
    } 
    catch (err) 
    {
        console.error('Error cargando estudiantes:', err.message);
    }
}
  
function renderStudentTable(students)
{
    const tbody = document.getElementById('studentTableBody');
    tbody.replaceChildren(); /* Elimina los tr y cualquier otro contenido que este en el cuerpo  de la tabla */
  
    students.forEach(student => /* Recorro el arreglo */
    {
        const tr = document.createElement('tr'); /* Creo la fila */
    
        tr.appendChild(createCell(student.fullname)); /* Le doy un hijo td, que se crea en createCell */
        tr.appendChild(createCell(student.email));
        tr.appendChild(createCell(student.age.toString()));
        tr.appendChild(createActionsCell(student));
    
        tbody.appendChild(tr);
    });
}
  
function createCell(text)
{
    const td = document.createElement('td');
    td.textContent = text;
    return td;
}
  
function createActionsCell(student)
{
    const td = document.createElement('td');
  
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Editar';
    editBtn.className = 'w3-button w3-blue w3-small';
    editBtn.addEventListener('click', () => fillForm(student)); /* Añado el evento de que al hacer click se llene el formulario con los datos del estudiante seleccionado */
  
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Borrar';
    deleteBtn.className = 'w3-button w3-red w3-small w3-margin-left';
    deleteBtn.addEventListener('click', () => confirmDelete(student.id)); /* Añado el evento de que al hacer click se invoque a la funcion de confirmacion de la eliminacion */
  
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
    if (!confirm('¿Estás seguro que deseas borrar este estudiante?')) return;
  
    try 
    {
        await studentAPI.remove(id);
        loadStudents();
    } 
    catch (err) 
    {
        console.error('Error al borrar:', err.message);
    }
}
  