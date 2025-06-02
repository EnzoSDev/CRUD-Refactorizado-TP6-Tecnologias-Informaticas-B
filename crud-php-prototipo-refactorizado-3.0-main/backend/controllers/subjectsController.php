<?php
/**
*    File        : backend/controllers/subjectsController.php
*    Project     : CRUD PHP
*    Author      : Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
*    License     : http://www.gnu.org/licenses/gpl.txt  GNU GPL 3.0
*    Date        : Mayo 2025
*    Status      : Prototype
*    Iteration   : 3.0 ( prototype )
*/

require_once("./models/subjects.php");

function handleGet($conn) 
{
    $input = json_decode(file_get_contents("php://input"), true);

    if (isset($input['id'])) 
    {
        $subject = getSubjectById($conn, $input['id']);
        echo json_encode($subject);
    } 
    else 
    {
        $subjects = getAllSubjects($conn);
        echo json_encode($subjects);
    }
}

function handlePost($conn) 
{
    $input = json_decode(file_get_contents("php://input"), true);
    $result = createSubject($conn, $input['name']);
    if ($result['inserted'] > 0) 
    {
        echo json_encode(["message" => "Materia creada correctamente"]);
    } 
    else 
    {
        http_response_code(500);
        echo json_encode(["error" => "No se pudo crear"]);
    /* Validacion de materia */
    /* Busco si ya tengo una materia con el mismo nombre */
    }$existe = getSubjectByName($conn, $input['name']);
    if($existe == NULL){
        $result = createSubject($conn, $input['name']);
        if ($result['inserted'] > 0) 
        {
            echo json_encode(["message" => "Materia creada correctamente"]);
        } 
        else 
        {
            http_response_code(500);
            echo json_encode(["error" => "No se pudo crear"]);
        }
    }
    else{
        http_response_code(400);
        echo json_encode(["error_code" => "SUBJECT_EXISTS"]);
    }
}

function handlePut($conn) 
{
    $input = json_decode(file_get_contents("php://input"), true);

    $result = updateSubject($conn, $input['id'], $input['name']);
    if ($result['updated'] > 0) 
    {
        echo json_encode(["message" => "Materia actualizada correctamente"]);
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

    $existe = getSubjectRelationById($conn, $input['id']);
    if($existe)
    {
        http_response_code(400);
        echo json_encode(["error" => "SUBJECT_IN_USE"]);
        return;
    }
    else{
        $result = deleteSubject($conn, $input['id']);
        if ($result['deleted'] > 0) 
        {
            echo json_encode(["message" => "Materia eliminada correctamente"]);
        } 
        else 
        {
            http_response_code(500);
            echo json_encode(["error" => "No se pudo eliminar"]);
        }
    }
}
?>