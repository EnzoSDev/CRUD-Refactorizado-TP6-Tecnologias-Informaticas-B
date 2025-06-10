<?php
/**
*    File        : backend/controllers/studentsController.php
*    Project     : CRUD PHP
*    Author      : Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
*    License     : http://www.gnu.org/licenses/gpl.txt  GNU GPL 3.0
*    Date        : Mayo 2025
*    Status      : Prototype
*    Iteration   : 3.0 ( prototype )
*/

require_once("./models/students.php");

function handleGet($conn) 
{
    $input = json_decode(file_get_contents("php://input"), true);
    
    if (isset($input['id'])) 
    {
        $student = getStudentById($conn, $input['id']);
        echo json_encode($student);
    } 
    else
    {
        $students = getAllStudents($conn);
        echo json_encode($students); 
        /* 
        
            Students ya es un arreglo de arreglos asociativos (Cada elemento es una fila con sus valores) listo (En el modelo se paso asi) para convertir en JSON 
            [
                ["id" => 1, "fullname" => "Juan", ...],
                ["id" => 2, "fullname" => "María", ...],
            ]
            
        */
    }
}

function handlePost($conn) 
{
    $input = json_decode(file_get_contents("php://input"), true);

    $existe = getStudentByEmail($conn, $input['email']);
    if($existe){
        http_response_code(400);
        echo json_encode(["error" => "STUDENT_EXISTS"]);
    }
    else{
        $result = createStudent($conn, $input['fullname'], $input['email'], $input['age']);
        if ($result['inserted'] > 0) /* Si se pudo insertar */
        {
            echo json_encode(["message" => "Estudiante agregado correctamente"]);
        } 
        else 
        {
            http_response_code(500);
            echo json_encode(["error" => "No se pudo agregar"]);
        }
    }
}

function handlePut($conn) 
{
    $input = json_decode(file_get_contents("php://input"), true);

    $result = updateStudent($conn, $input['id'], $input['fullname'], $input['email'], $input['age']);
    if ($result['updated'] > 0) /* Si se pudo actualizar */
    {
        echo json_encode(["message" => "Actualizado correctamente"]);
    } 
    else 
    {
        http_response_code(500);
        echo json_encode(["error" => "No se pudo actualizar"]);
    }
}

function handleDelete($conn) 
{
    $input = json_decode(file_get_contents("php://input"), true);

    $existe = getStudentRelationById($conn, $input['id']);
    if ($existe) /* Si existe el estudiante */
    {
        http_response_code(404);
        echo json_encode(["error" => "STUDENT_IN_USE"]);
    }
    else{
        $result = deleteStudent($conn, $input['id']);
        if ($result['deleted'] > 0) /* Si se pudo eliminar */ 
        {
            echo json_encode(["message" => "Eliminado correctamente"]);
        } 
        else 
        {
            http_response_code(500);
            echo json_encode(["error" => "No se pudo eliminar"]);
        }
    }
}
?>