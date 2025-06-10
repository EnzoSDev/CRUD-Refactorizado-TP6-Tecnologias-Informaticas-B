<?php
/**
 * 
 * 
 * 
 * 
 * Apuntes Clase 7/05
 * 
 * El modo debug es una buena practica para el desarrollador en el entorno de desarrollo, pero en el entorno de produccion no es recomendable
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * DEBUG MODE 
 */
ini_set('display_errors', 1); /* Le dice a PHP que muestre los errores en la pantalla */
error_reporting(E_ALL); /* Muestra todos los errores, advertencias y avisos de PHP */

/* 

    En el entorno de produccion no es recomendable mostrar los errores en la pantalla, ya que puede exponer información sensible. En su lugar, se recomienda registrar los errores en un archivo de registro (Log) y mostrar un mensaje genérico al usuario. 
    
*/


/*
    Los headers son instrucciones que se envían al navegador antes de enviar el contenido de la página.

    Son instrucciones HTTP para respetar CORS (Cross-Origin Resource Sharing), que es un mecanismo de seguridad que permite o restringe el acceso a recursos en un servidor desde diferentes dominios o puertos


*/

header("Access-Control-Allow-Origin: *"); /* Se permite el acceso al servidor desde cualquier origen. En produccion se recomienda especificar el origen permitido */

header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS"); /* Metodos HTTP permitidos */

header("Access-Control-Allow-Headers: Content-Type"); /* Sirve para indicar que el servidor acepta el encabezado Content-Type en las solicitudes. */

/* 

    Un cliente puede enviar headers (instrucciones adicionales) al servidor como parte del protocolo HTTP, a través de los "encabezados HTTP".

    Por eso aca se configura como seran esos headers, por ejemplo, el header Content-Type indica el tipo de contenido que se está enviando en la solicitud. En este caso, se permite el tipo de contenido "application/json", que es el formato JSON.
    Esto es importante porque el servidor necesita saber cómo interpretar los datos que recibe.
    En este caso, se permite el tipo de contenido "application/json", que es el formato JSON.

*/


if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200); /* Buena Practica: Responder con un código de estado 200 (OK) para las solicitudes OPTIONS. Esto indica que el servidor está listo para recibir la solicitud real. */
    exit();
}

/*

    Cuando un cliente realiza una peticion HTTP al servidor siguiendo con los estandares de CORS se hace esto:

    El navegador por defecto envia una solicitud OPTIONS antes de enviar la solicitud real (GET, POST, PUT, DELETE) para verificar qué métodos y encabezados son permitidos por el servidor.
    Si la solicitud es de tipo OPTIONS, se envía una respuesta con el código de estado 200 (OK) y se termina la ejecución del script. Esto es necesario para cumplir con las políticas de CORS y permitir que el navegador realice la solicitud real.
    Si la solicitud no es de tipo OPTIONS, se continúa con la ejecución del script y se procesan las rutas definidas a continuación.

    Este proceso se llama  preflight request (preverificación)
    
    En el caso de que el servidor acepte y devuelva OK, ahi el navegador enviara la solicitud real (GET, POST, PUT, DELETE) al servidor.

    Cuando por ejemplo un post, no entra al if y ejecuta el require_once de abajo

    TODO ESTO SE DA UNA VEZ QUE DESDE JS SE HACE UNA PETICION CON FETCH O AJAX, POR EJEMPLO, QUIERO CREAR UN NUEVO USUARIO (Completo los datos en el formulario y le doy agregar), con el navegador envia primero el OPTIONS y luego el POST, si el servidor responde OK, el navegador envia el POST con los datos del formulario.

    Si por algun motivo el servidor no responde OK, el navegador no enviara el POST y mostrara un error en la consola. Esto es una medida de seguridad para evitar que un sitio web malicioso acceda a los recursos de otro dominio sin permiso.

*/







/*

    ################ SOLUCION EJERCICIO 3 ################

    La idea es crear un array asociativo de metodos y por cada elemento tengo las rutas

    Basicamente desde JS hago las peticiones pasando por parametro o por body HTTP el recurso 
    que quiero usar

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

    Una vez que logre pasar el nombre del recurso de alguna manera lo obtengo (Accediendo al
    array asociativo de GET o haciendo
        $inputJSON = file_get_contents('php://input');
        $input = json_decode($inputJSON, true);
    para sacarlo del body)

    y con eso lo busco en el arreglo de rutas y obtengo la direccion de la ruta correspondiente

    Lo que tiene esto es que cada ruta tiene que tener asociado un archivo y un controlador

    Esto esta bien asi? Yo se que seguramente se pueda hacer de otras formas pero como primera
    vez es lo que pude hacer :)
*/

$rutas = [
        'students' => './routes/studentsRoutes.php',
        'subjects' => './routes/subjectsRoutes.php'
];

$metodo = $_SERVER["REQUEST_METHOD"];
if($metodo === 'GET')
    if(isset($rutas[$_GET['recurso']]) && isset($rutas[$_GET['recurso']])) /* Esto esta bien? */
        require_once($rutas[$_GET['recurso']]);
    else{
        http_response_code(404);
        echo json_encode(["error" => "Recurso no encontrado"]);
    }
else{
    $inputJSON = file_get_contents('php://input');
    $input = json_decode($inputJSON, true);
    if(isset($rutas[$input['recurso']]) && isset($rutas[$input['recurso']])) /* Esto esta bien? */
        require_once($rutas[$input['recurso']]);
    else{
        http_response_code(404);
        echo json_encode(["error" => "Recurso no encontrado"]);
    }
}







/*

############### CONSULTAR ###############

Al parecer no esta mal la solucion, de hecho se suele hacer eso de poner un /ruta pero no se como hacerlo




Esta solucion no esta bien ya que mi API_URL en JS es ../backend/server.php y no puedo poner /students, me cambia todo y no accedo a server.php y ademas que con lo de abajo obtengo toda la ruta (uri: ../backend/server.php/students)

Lo dejo igual para saber lo que era el uri y que existia esto

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH); /* Obtiene la URI de la solicitud y la analiza para obtener la ruta

    La uri es una parte de la URL que identifica un recurso en el servidor. En este caso, se está utilizando la función parse_url para obtener solo la parte de la ruta de la URL solicitada. Esto es útil para determinar qué recurso se está solicitando y cómo manejarlo.
    La función parse_url toma la URL completa y devuelve un array con diferentes componentes de la URL, como el esquema (http, https), el host, la ruta, los parámetros de consulta, etc. En este caso, se está utilizando PHP_URL_PATH para obtener solo la parte de la ruta.

    if(isset($rutas[$uri]))
     require_once($rutas[$uri]);
else
    http_response_code(404); Si la ruta no existe, se devuelve un código de estado 404 (No encontrado)
    echo "Ruta no encontrada";  Mensaje de error para el usuario

*/










/* ############## Codigo original ###############    
require_once("./routes/studentsRoutes.php");
/*

    Es como un include pero devuelve un error si no encuentra el archivo, en vez de un warning.
    require_once se utiliza para incluir un archivo PHP en otro archivo PHP. La diferencia entre require y require_once es que require_once solo incluye el archivo una vez, incluso si se llama varias veces. Esto evita problemas de redefinición de funciones o clases si el archivo se incluye más de una vez.
    require_once es útil para incluir archivos de configuración, bibliotecas o clases que no deben ser incluidos más de una vez en el mismo script. Si el archivo ya ha sido incluido, require_once no lo volverá a incluir y no generará un error.
    En este caso, se está incluyendo el archivo de rutas de estudiantes (studentsRoutes.php) que contiene la lógica para manejar las solicitudes relacionadas con los estudiantes. Esto permite que el servidor procese las solicitudes y devuelva las respuestas adecuadas según la ruta solicitada.

/* Consigna ¿Como agrego nuevos modulos pero sin switch, con alguna convencion? (Punto 3) */
?>