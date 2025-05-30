<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') 
{
    http_response_code(200);
    exit();
}

/* ################## PARTE NUEVA ######################## */

$uri = parse_url($_SERVER['REQUEST_URI']); 

/* 

    Uso la superglobal &_SERVER y accedo a un elemento del arreglo asociativo
    que es "REQUEST_URI" para obtener la URL completa

    Eso se PARSEA, es decir, analizar una cadena de texto para descomponerla en partes significativas que se puedan procesar facilmente (Darle formato)
    Esas partes son el path (Ej: ../../backend/server.php), query (Los parametros Ej: module=students)

    Ej: $_SERVER['REQUEST_URI'] = "/Tecnologias_Informaticas_B/crud-php-prototipo-refactorizado-2.0-main/backend/server.php?module=students";

    $uri = [
        'path' => '/Tecnologias_Informaticas_B/crud-php-prototipo-refactorizado-2.0-main/backend server.php',
        'query' => 'module=students'
    ];



*/
$query = $uri['query']; /* Obtengo los parametros $query = 'module=students' */
parse_str($query,$query_array); 
/* 
    
    Convierte la cadena en un arreglo asociativo
    $query_array = [
        'module' => 'students'
    ];
 
*/
$module = $query_array['module']; /* Obtengo el parametro module $module = 'students'; */

if (!$module) 
/* 

    Si no existe tiro un error 400 (Error en la peticion del cliente, por ejemplo
    la peticion no tiene parametro module, http://backend/server.php FALTA MODULE=algo) 
    
*/
{
    http_response_code(400);
    echo json_encode(["error" => "Módulo no especificado"]);
    exit();
}

$routeFile = __DIR__ . "/routes/{$module}Routes.php";

/*

    __DIR__ es una constante que dice la ruta actual del archivo, a eso se le concatena la direccion de la ruta del modulo requerido

*/

if (file_exists($routeFile))  /* Si hay archivo en esa ruta lo incluyo */
{
    require_once($routeFile);
} 
else 
{
    http_response_code(404);
    echo json_encode(["error" => "Ruta para el módulo '{$module}' no encontrada"]);
}
