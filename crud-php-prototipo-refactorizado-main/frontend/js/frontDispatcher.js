//frontDispatcher_2.0
const API_URL = '../backend/server.php'; /* Constante con la direccion del servidor */
/* Es buena practica tenerlo siempre al inicio en una constante */

document.addEventListener('DOMContentLoaded', () => 
/* 

    Todo el codigo se ejecutara cuando el navegador haya cargado todo el HTML
    Tambien se podria poner el <script src="js/frontDistpacher.js"></script> abajo del todo en el HTML para evitar usar los botones y formularios sin que hayan cargado 

*/
{
    const studentForm = document.getElementById('studentForm'); /* Obtengo el formulario de estudiantes por su ID */
    const studentTableBody = document.getElementById('studentTableBody'); /* Obtengo el cuerpo de la tabla de estudiantes por su ID*/

    /* Obtengo los inputs del formulario */
    const fullnameInput = document.getElementById('fullname');
    const emailInput = document.getElementById('email');
    const ageInput = document.getElementById('age');
    const studentIdInput = document.getElementById('studentId'); /* ID oculto para saber a que elemento de la BD se va a actualizar */



    // Leer todos los estudiantes al cargar
    fetchStudents();

    // Formulario: Crear o actualizar estudiante



    /* Este evento se queda escuchando hasta que se le de submit al formulario (Se toque Guardar) */
    studentForm.addEventListener('submit', async (e) => { 
        
    /* 
        El evento es "submit" y ejecuto una funcion flecha asincrona ya que se intentara consultar a una base de datos por medio de una peticion a un servidor.
        e es un parametro que almacena el eventObject y con esto puedo usar propiedades del evento (Ej: e.type indica que tipo de evento se uso) 
    
    */
        e.preventDefault(); 
        
        /* 
        
            Evito que se cargue la pagina como lo trataria de hacer tradicionalmente el navegador ya que yo quiero hacer la peticion desde JS con fetch y actualizar dinamicamente sin recargar la pagina (Trabajo con asincronia) 
            
        */

        /* Creo un objeto (Una especie de struct en C) con los datos del formulario */
        const formData = {
            fullname: fullnameInput.value,
            email: emailInput.value,
            age: ageInput.value,
            recurso: 'students',
        };


        const id = studentIdInput.value;
        const method = id ? 'PUT' : 'POST'; 
        /* 

            Es un operador condicional como en C, (id) seria si existe el id uso el metodo PUT para actualizar sino el POST para agregar 
            El id tambien me sirve como indicador del metodo que le pase
            
        */
        if (id) formData.id = id; 
        
        /*

            Si existe agrego un campo al objeto que se llame id y le paso el id a actualizar para que en el backend se haga la consulta SQL ya con el id y no se tenga que buscar 

        */

        try /* Intento hacer la peticion */
        {
            const response = await fetch(API_URL, {
                method, /* method : method (method tendra PUT o POST) */
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData), /* Convierto a cadena JSON y paso el objeto */
            });

            if (response.ok) { /* Si salio todo bien */
                studentForm.reset(); /* Reinicio los valores del formulario */
                studentIdInput.value = ''; 
                /* 
                    
                    Aca esta lo importante, cuando el formulario se usa para crear un id, este campo es vacio, sino se le asignaria un id al darle en editar sobre cualquier fila. Por defecto lo dejo vacio, si se toca en algun boton de editar se colocara un id en ese valor
                
                    */
                await fetchStudents(); /* Renderizo la tabla con esta funcion */
            } else {
                alert("Error al guardar");
            }
        } catch (err) {
            console.error(err);
        }
    });

    // Obtener estudiantes y renderizar tabla
    async function fetchStudents() 
    {
        try /* Se intentara hacer la peticion y actualizar la tabla */
        {



            /* 
            
                ############ EJERCICIO 3 GUIA 6 ############
                const res = await fetch(API_URL + "?recurso='students');

                Deberia hacer esto en cada peticion http en todas las funciones

                y en las que no sean GET deberia hacer esto

                const res = await fetch(API_URL, {
                    method: 'POST, 'DELETE', 'PUT', etc,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringfy({
                        recurso: Aca pongo 'student', 'subject', etc
                    })
                })

            */




            /* Se hace la peticion HTTP con el metodo GET y con await se pausa la funcion esperando una respuesta */
            const res = await fetch(API_URL + "?recurso=students"); /* Ejercicio 3 */
            const students = await res.json(); 
            
            /* 
            
                La respuesta de la API (Un JSON) se convierte en un arreglo
                Si el backend devuelve: 
                [
                    { "fullname": "Juan", "email": "juan@mail.com", "age": 21 },
                    { "fullname": "Ana", "email": "ana@mail.com", "age": 22 }
                ]
                En students se almacena (Gracias a .json):

                [
                    { fullname: "Juan", email: "juan@mail.com", age: 21 },
                    { fullname: "Ana", email: "ana@mail.com", age: 22 }
                ]
                A la vista parecen lo mismo, pero sin .json seria un string y con el .json es un arreglo de objetos (Un tipo de dato que se pude recorrer en JS con forEach)
                
            */

            //Limpiar tabla de forma segura.
            studentTableBody.replaceChildren();
            //acá innerHTML es seguro a XSS porque no hay entrada de usuario
            //igual no lo uso.
            //studentTableBody.innerHTML = "";

            /*

                Es mas seguro usar funciones propias del DOM como createElement, appendChild y replaceChildren en lugar de usar innerHTML que inserta contenido HTML como texto en un elemento.
                Ej: studentTableBody.innerHTML = "<tr><td>Ana</td><td>ana@mail.com</td></tr>";
                

                Esto evita inyecciones XSS (Cross-Site Scripting)
                
                Si metés datos directamente del usuario (por ejemplo: un nombre que alguien escribió en un formulario) y los inyectás con innerHTML, un atacante puede insertar código malicioso como:
                <script>alert('Hackeado!');</script>

                No usar innerHTML tambien:
                    Es más controlado y menos propenso a errores.
                    No borra y recrea todo el contenido, lo cual ayuda al rendimiento.


            */


            /* Se itera sobre cada elemento del vector llamandolo student (Seria el i en los for que estoy mas acostumbrado) */
            students.forEach(student => {
                const tr = document.createElement('tr'); /* Creo una fila */

                const tdName = document.createElement('td'); /* Creo la columna para el nombre */
                tdName.textContent = student.fullname; /* Con textContent modifico el contenido de esa celda */

                const tdEmail = document.createElement('td');
                tdEmail.textContent = student.email;

                const tdAge = document.createElement('td');
                tdAge.textContent = student.age;

                const tdActions = document.createElement('td');
                const editBtn = document.createElement('button'); /* Creo boton de editar */
                editBtn.textContent = 'Editar';
                editBtn.classList.add('w3-button', 'w3-blue', 'w3-small', 'w3-margin-right'); /* Le paso las clases del framework para darle estilo de w3 */
                editBtn.onclick = () => { /* Al hacer click en el */

                    /* Pongo los datos de la fila en el formulario para poder cambiar desde el que ya tengo */
                    fullnameInput.value = student.fullname;
                    emailInput.value = student.email;
                    ageInput.value = student.age;

                    /* El id de la fila correspondiente en la BD se pone en el campo oculto del formulario para poder distinguir entre editar o crear uno de nuevo */
                    studentIdInput.value = student.id;
                };

                /* Mismo proceso que con editBtn */
                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'Borrar';
                deleteBtn.classList.add('w3-button', 'w3-red', 'w3-small');
                deleteBtn.onclick = () => deleteStudent(student.id); /* Al hacer click se borra llama a la funcion deleteStudent que borrara la fila */

                /* Asi es mas seguro que usando innerHTML */

                /* Coloca los botones como hijos de la etiqueta <td></td> */
                tdActions.appendChild(editBtn);
                tdActions.appendChild(deleteBtn);

                /* Coloca los <td></td> como hijos de <tr></tr> */
                tr.appendChild(tdName);
                tr.appendChild(tdEmail);
                tr.appendChild(tdAge);
                tr.appendChild(tdActions);

                /* Coloca a <tr></tr> como hijo del cuerpo de la tabla <tbody></tbody> */
                studentTableBody.appendChild(tr);
            });
        } catch (err) { /* Si no se pudo hacer devuelve un error, err es el error que le paso try */
            console.error("Error al obtener estudiantes:", err);
        }
    }

    // Eliminar estudiante
    async function deleteStudent(id) 
    {
        if (!confirm("¿Seguro que querés borrar este estudiante?")) return; /* Si se toco en cancelar (Se devuelve false con el ! es true) no intento el try ya que salgo con return */

        try 
        {
            const response = await fetch(API_URL, { /* Hago una peticion para borrar (Paso un JSON) */
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, recurso: 'students' }), /* Ejercicio 3 */
                /* 
                
                    Esto ultimo es el cuerpo de la peticion HTTP, le paso dos cosas, el id de la fila a borrar y el recurso (Eso para el ejercicio 3 de la guia 6)
                    Con JSON.stringify convierto el objeto JS en una cadena JSON

                    Pd: Usar {id} es una forma abreviada de poner {id : id}

                */
            });

            if (response.ok) { /* Ok devuevle el codigo de estado de la solicitud HTTP (Si esta entre 200 y 300 response.ok sera verdadero y podre invocar a la funcion para mostrar la tabla) en otro caso respondera falso */
                await fetchStudents();
            } else {
                alert("Error al borrar");
            }
        } catch (err) {
            console.error(err);
        }
    }
});
