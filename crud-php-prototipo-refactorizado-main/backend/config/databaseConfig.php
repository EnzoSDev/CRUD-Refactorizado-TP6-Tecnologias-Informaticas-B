<?php
$host = "localhost";
$user = "students_user";
$password = "12345";        
$database = "students_db";

/* En produccion podria hacer $host = getenv("DB_host") y user = getenv("DB_user) para no mostrar 
ciertos datos, se usa un archivo .env y ahi se ponen las credenciales reales. */

$conn = new mysqli($host, $user, $password, $database);

if ($conn->connect_error) {
    http_response_code(500); 
    /* 
        Establece un código de estado HTTP (500 -> Error en el servidor)
        
        ╔════════╦════════════════════════════════════════════════════╗
        ║ CÓDIGO ║ SIGNIFICADO                                        ║
        ╠════════╬════════════════════════════════════════════════════╣
        ║ 1xx    ║ Informativos                                       ║
        ║ 100    ║ Continue                                           ║
        ║ 101    ║ Switching Protocols                                ║
        ╠════════╬════════════════════════════════════════════════════╣
        ║ 2xx    ║ Éxito                                              ║
        ║ 200    ║ OK                                                 ║
        ║ 201    ║ Created (recurso creado)                           ║
        ║ 204    ║ No Content (sin contenido que mostrar)             ║
        ╠════════╬════════════════════════════════════════════════════╣
        ║ 3xx    ║ Redirección                                        ║
        ║ 301    ║ Moved Permanently                                  ║
        ║ 302    ║ Found (redirección temporal)                       ║
        ║ 304    ║ Not Modified (no cambió desde última)              ║
        ╠════════╬════════════════════════════════════════════════════╣
        ║ 4xx    ║ Error del cliente                                  ║
        ║ 400    ║ Bad Request (sintaxis incorrecta)                  ║
        ║ 401    ║ Unauthorized (no autenticado)                      ║
        ║ 403    ║ Forbidden (prohibido)                              ║
        ║ 404    ║ Not Found (no encontrado)                          ║
        ║ 405    ║ Method Not Allowed                                 ║
        ║ 422    ║ Unprocessable Entity (validación)                  ║
        ╠════════╬════════════════════════════════════════════════════╣
        ║ 5xx    ║ Error del servidor                                 ║
        ║ 500    ║ Internal Server Error                              ║
        ║ 502    ║ Bad Gateway                                        ║
        ║ 503    ║ Service Unavailable                                ║
        ╚════════╩════════════════════════════════════════════════════╝
    */
    die(json_encode(["error" => "Database connection failed"])); 
}
?>