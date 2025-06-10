<?php
/**
*    File        : backend/config/databaseConfig.php
*    Project     : CRUD PHP
*    Author      : Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
*    License     : http://www.gnu.org/licenses/gpl.txt  GNU GPL 3.0
*    Date        : Mayo 2025
*    Status      : Prototype
*    Iteration   : 3.0 ( prototype )
*/

$host = "localhost";
$user = "students_user";
$password = "12345";
$database = "students_db";

/*

    NUNCA PONER CREDENCIALES DE BASE DE DATOS EN EL CÓDIGO FUENTE
    En un entorno de producción, es recomendable usar variables de entorno o un archivo de configuración separado
    NUNCA PUBLICAR CREDENCIALES DE BASE DE DATOS EN REPOSITORIOS PÚBLICOS

    (Mejorar esta parte mas tarde!!!!!!!!!!!!!!)

*/

$conn = new mysqli($host, $user, $password, $database);

if ($conn->connect_error) 
{
    http_response_code(500);
    die(json_encode(["error" => "Database connection failed"]));
}
?>