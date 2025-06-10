<?php
/**
*    File        : backend/routes/routesFactory.php
*    Project     : CRUD PHP
*    Author      : Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
*    License     : http://www.gnu.org/licenses/gpl.txt  GNU GPL 3.0
*    Date        : Mayo 2025
*    Status      : Prototype
*    Iteration   : 3.0 ( prototype )
*/

/*

    Este archivo es como un despachador de rutas. 
    
        Recibe las peticiones HTTP y llama a la función que las maneja.
    
        Tiene un comportamiento por defecto (basado en nombres convencionales como handleGet, handlePost, etc.).
        
        Puede ser personalizado para casos especiales (por ejemplo, validaciones en POST).
        
        Devuelve errores en formato JSON y con códigos HTTP estandarizados

*/

function routeRequest($conn, $customHandlers = [], $prefix = 'handle') 

/* 

    Esta funcion recibe un arreglo (Opcional) con funciones personalizadas para manejar cada metodo HTTP
    y un prefijo (Opcional) para los nombres de las funciones que se llamaran
    por defecto, si no se especifica el prefijo, se usara 'handle' (ESTO ES UNA CONVENCION) 

    Esto permite que todo funcione bien para cualquier modulo y que ademas se pueda extender la funcionalidad de las rutas
   
*/
{
    $method = $_SERVER['REQUEST_METHOD'];

    // Lista de handlers CRUD por defecto
    $defaultHandlers = [
        'GET'    => $prefix . 'Get', /* Segun el metodo HTTP se obtiene el nombre de la funcion del controlador correspondiente */
        'POST'   => $prefix . 'Post',
        'PUT'    => $prefix . 'Put',
        'DELETE' => $prefix . 'Delete'
    ];

    /* Con esto espero obtener por ejemplo "handleGet", "handlePost", etc. */

    // Sobrescribir handlers por defecto si hay personalizados
    $handlers = array_merge($defaultHandlers, $customHandlers);

    /* 
    
        En caso de que haya handlers personalizados, se sobrescriben los por defecto
        La función array_merge en PHP combina dos o más arrays en uno solo. Si hay claves iguales, los valores del array que aparece después sobrescriben los anteriores.
        
        Ej:

        Si al invocar a esta función se pasa un arreglo como:
        [
            'POST' => function($conn) { lógica personalizada }
        ]

        Cuando se llame al método POST, se ejecutará la función personalizada en lugar de la función por defecto 'handlePost'.
        
    */

    if (!isset($handlers[$method]))  /* Si no tengo un manejador para el método HTTP actual */
    {
        http_response_code(405);
        echo json_encode(["error" => "Método $method no permitido"]);
        return;
    }

    $handler = $handlers[$method]; /* Si tengo un manejador para el método HTTP actual, lo obtengo (Ej: "handlerGet" es un string) */

    if (is_callable($handler)) /* Si la función es callable (es decir, se puede llamar como una función) */ 
    {
        $handler($conn);
        /*

        Se ejecuta con $handler($conn) porque en PHP, si $handler es:

            Una función anónima (closure)
            El nombre de una función como string (Esto sucede ya que los nombres de las funciones son valores string del arreglo asociativo $handlers)
            Un array con [objeto, método]
        
        ...entonces puedes llamarla directamente usando paréntesis y pasarle argumentos, igual que cualquier función.

        */
    }
    else
    {
        http_response_code(500);
        echo json_encode(["error" => "Handler para $method no es válido"]);
    }
}
