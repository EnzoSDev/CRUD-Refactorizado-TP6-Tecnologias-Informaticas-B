<?php
require_once("./config/databaseConfig.php"); /* Todas las rutas se hacen desde el server.php (Seria como el main) */
/* Aca tengo disponible la variable conn */
require_once("./controllers/studentsController.php"); /* Tiene las funciones que implementan la logica del CRUD, las handle */

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        handleGet($conn);
        break;
    case 'POST':
        handlePost($conn);
        break;
    case 'PUT':
        handlePut($conn);
        break;
    case 'DELETE':
        handleDelete($conn);
        break;
    default:
        http_response_code(405); /* Metodo no permitido */
        echo json_encode(["error" => "Método no permitido"]);
        break;
}
?>