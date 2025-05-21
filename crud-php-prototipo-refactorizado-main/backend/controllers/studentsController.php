<?php

/*
Los controllers son los encargados de recibir las peticiones del cliente y devolver las respuestas. En este caso, se encargan de recibir las peticiones CRUD (Create, Read, Update, Delete) sobre la tabla "students" y devolver las respuestas correspondientes.

No accede a la base de datos sino que delega esa tarea al modelo
*/
require_once("./models/students.php"); /*  Incluyo al modelo, capa encargada de acceder a los datos */



/* No entiendo como funciona */

function handleGet($conn) {
    if (isset($_GET['id'])) { /* Valido que se haya pasado un id */
        $result = getStudentById($conn, $_GET['id']);
        echo json_encode($result->fetch_assoc());
    } else {
        $result = getAllStudents($conn);
        $data = [];
        while ($row = $result->fetch_assoc()) { /* Por cada fila (Arreglo asociativo) se pone un nuevo elemento en data, seria como un push se pone al final y queda un arreglo de arreglos, es decir, cada elemento es una fila con las columnas y sus valores*/
            $data[] = $row;
        }
        echo json_encode($data);
    }
}

function handlePost($conn) {
    $input = json_decode(file_get_contents("php://input"), true); /* Esto decodifica el JSON y accede al body de la peticion y devuelve un arreglo asociativo en $input */
    if (createStudent($conn, $input['fullname'], $input['email'], $input['age'])) {
        echo json_encode(["message" => "Estudiante agregado correctamente"]); /* Codifica el dato php en uno JSON para poder devolverlo al fetch de JS */
    } else {
        http_response_code(500);
        echo json_encode(["error" => "No se pudo agregar"]);
    }
}

function handlePut($conn) {
    $input = json_decode(file_get_contents("php://input"), true);
    if (updateStudent($conn, $input['id'], $input['fullname'], $input['email'], $input['age'])) {
        echo json_encode(["message" => "Actualizado correctamente"]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "No se pudo actualizar"]);
    }
}

function handleDelete($conn) {
    $input = json_decode(file_get_contents("php://input"), true);
    if (deleteStudent($conn, $input['id'])) {
        echo json_encode(["message" => "Eliminado correctamente"]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "No se pudo eliminar"]);
    }
}
?>
