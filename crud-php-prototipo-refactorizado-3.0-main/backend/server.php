<?php
/**
*    File        : backend/server.php
*    Project     : CRUD PHP
*    Author      : Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
*    License     : http://www.gnu.org/licenses/gpl.txt  GNU GPL 3.0
*    Date        : Mayo 2025
*    Status      : Prototype
*    Iteration   : 3.0 ( prototype )
*/

/**FOR DEBUG: */
// ini_set('display_errors', 1);
// ini_set('display_startup_errors', 1);
// error_reporting(E_ALL);

// Configuración de cabeceras CORS
header("Access-Control-Allow-Origin: *"); /* Se permite que cualquier origen pueda acceder a este recurso, en produccion se suele poner una direccion en lugar del * */
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type"); /* Permite que el cliente envíe encabezados personalizados en la solicitud, como Content-Type */

function sendCodeMessage($code, $message = "")
{
    http_response_code($code);
    echo json_encode(["message" => $message]);
    exit();
}

// Respuesta correcta para solicitudes OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS')
{
    sendCodeMessage(200); // 200 OK
}

// Obtener el módulo desde la query string
$uri = parse_url($_SERVER['REQUEST_URI']); /* Obtiene la URI actual y la descompone en sus componentes */

/*

    url: https://ejemplo.com/productos/listado.php?id=12
    uri: /productos/listado.php?id=12

    parse_url devuelve un arreglo asociativo con las partes de la URL:
    [
        'scheme' => 'https',
        'host' => 'ejemplo.com',
        'path' => '/productos/listado.php',
        'query' => 'id=12'
    ]

*/

$query = $uri['query'] ?? ''; /* Sino hay parametros de consulta, se asigna una cadena vacía */
parse_str($query, $query_array);
$module = $query_array['module'] ?? null; /* Si no existe el parámetro 'module' (Elemento en el arreglo asociativo de parametros), se asigna null */

// Validación de existencia del módulo
if (!$module)
{
    sendCodeMessage(400, "Módulo no especificado");
}

// Validación de caracteres seguros: solo letras, números y guiones bajos
if (!preg_match('/^\w+$/', $module))
{
    sendCodeMessage(400, "Nombre de módulo inválido");
}

// Buscar el archivo de ruta correspondiente
$routeFile = __DIR__ . "/routes/{$module}Routes.php";

if (file_exists($routeFile))
{
    require_once($routeFile);
}
else
{
    sendCodeMessage(404, "Ruta para el módulo '{$module}' no encontrada");
}
