<?php
/*
Los models son los encargados de interactuar con la base de datos. En este caso, se encargan de realizar las operaciones CRUD (Create, Read, Update, Delete) sobre la tabla "students".
*/





/* Por que hay distintos return en cada funcion?
    - En las funciones de lectura (getAllStudents y getStudentById) se devuelve el resultado de la consulta, que es un objeto de tipo mysqli_result. Un objeto de este tipo seria un arreglo asociativo con los resultados de la consulta.
    
    - En las funciones de escritura (createStudent, updateStudent y deleteStudent) se devuelve true o false dependiendo de si la operación fue exitosa o no.
*/
function getAllStudents($conn) {
    $sql = "SELECT * FROM students";
    return $conn->query($sql); 
    /* 
    
        Traigo todos los datos de la tabla, no hay riesgo de inyeccion SQL

        Retorna un objeto mysqli_result (Resultado de una consulta)
    
     */
}

function getStudentById($conn, $id) {
    $sql = "SELECT * FROM students WHERE id = ?"; /* No inserto directamente el id, para evitar inyecciones SQL, usa un marcador de posicion "?" */
    $stmt = $conn->prepare($sql); /* El motor de MySQL analiza la estructura antes de saber el id (Se hace una consulta preparada, se valida que es comando)*/
    $stmt->bind_param("i", $id); /* Inserto el id, i es de tipo entero (s es string. d double y b blob) */
    $stmt->execute(); /* Se ejecuta la consulta con el valor reemplazado */
    return $stmt->get_result(); /* Devuelve una fila */
}

function createStudent($conn, $fullname, $email, $age) {
    $sql = "INSERT INTO students (fullname, email, age) VALUES (?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssi", $fullname, $email, $age);
    return $stmt->execute(); /* True si se pudo hacer la consulta */
}

function updateStudent($conn, $id, $fullname, $email, $age) {
    $sql = "UPDATE students SET fullname = ?, email = ?, age = ? WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssii", $fullname, $email, $age, $id);
    return $stmt->execute();
}

function deleteStudent($conn, $id) {
    $sql = "DELETE FROM students WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);
    return $stmt->execute();
}
?>