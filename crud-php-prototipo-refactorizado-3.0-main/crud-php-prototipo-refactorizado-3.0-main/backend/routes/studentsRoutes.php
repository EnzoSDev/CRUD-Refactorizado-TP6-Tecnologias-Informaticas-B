<?php
/**
*    File        : backend/routes/studentsRoutes.php
*    Project     : CRUD PHP
*    Author      : Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
*    License     : http://www.gnu.org/licenses/gpl.txt  GNU GPL 3.0
*    Date        : Mayo 2025
*    Status      : Prototype
*    Iteration   : 3.0 ( prototype )
*/

require_once("./config/databaseConfig.php");
require_once("./routes/routesFactory.php");
require_once("./controllers/studentsController.php");

// routeRequest($conn);

/*

    Esta linea esta comentado ya que si la usara se usaria la ruta por defecto para el controlador por defecto
    La funcion routeRequest() tiene mas parametros ya que se hizo para agregar extras a las peticiones y hacer validaciones

*/


/**
 * 
 * Si uno quisieria extender la funcionalidad de las rutas se puede hacer lo siguiente
 * 
 * 
 * 
 * En este caso, se define un manejador personalizado para el método POST
 * que incluye una validación adicional antes de llamar al manejador por defecto.
 * 
 * 
 * Ejemplo de como se extiende un archivo de rutas 
 * para casos particulares
 * o validaciones:
 * 
 */
routeRequest($conn, [ /* Arreglo con las acciones para cada metodo */
    'POST' => function($conn) /* Si es POST se ejecuta esta funcion */
    {
        // Validación o lógica extendida
        /* Esto lo hago por si hay peticiones POST que no vengan del formulario y que no hayan tenido las validaciones del mismo (Ej: fullname vacio) */
        $input = json_decode(file_get_contents("php://input"), true);
        if (empty($input['fullname'])) 
        {
            http_response_code(400);
            echo json_encode(["error" => "Falta el nombre"]);
            return;
        }
        handlePost($conn); /* Finalmente se llama al manejador por defecto */
    }
]);