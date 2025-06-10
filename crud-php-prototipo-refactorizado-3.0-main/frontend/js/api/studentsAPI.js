/**
*    File        : frontend/js/api/studentsAPI.js
*    Project     : CRUD PHP
*    Author      : Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
*    License     : http://www.gnu.org/licenses/gpl.txt  GNU GPL 3.0
*    Date        : Mayo 2025
*    Status      : Prototype
*    Iteration   : 3.0 ( prototype )
*/

import { createAPI } from './apiFactory.js';
export const studentsAPI = createAPI('students'); /* Se le pasa el nombre del modulo 'students' a la función createAPI */

/*

    Se recibe la función createAPI que se encuentra en el archivo apiFactory.js.
    Esta variable se exporta para que pueda ser utilizada en otros archivos.

*/
