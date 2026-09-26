<?php

session_start();

header("Content-Type: application/json");

if (isset($_SESSION["id_client"])) {

    echo json_encode([
        "connecte" => true,
        "id_client" => $_SESSION["id_client"],
        "nom" => $_SESSION["nom_client"],
        "role" => $_SESSION["role"]
    ]);

} else {

    echo json_encode([
        "connecte" => false
    ]);
}

?>