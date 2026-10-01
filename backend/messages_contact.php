<?php

require_once "verifier_admin.php";
require_once "connexion.php";

// Récupérer tous les messages reçus
$requete = $connexion->query(
    "SELECT id_message, nom, email, sujet, message, date_message
     FROM message_contact
     ORDER BY date_message DESC"
);

$messages = $requete->fetchAll(PDO::FETCH_ASSOC);

// Envoyer les messages à JavaScript au format JSON
header("Content-Type: application/json");

echo json_encode($messages);

?>