<?php

require_once "connexion.php";

// Récupérer les informations envoyées par JavaScript
$nom = $_POST["nom"];
$email = $_POST["email"];
$sujet = $_POST["sujet"];
$message = $_POST["message"];

// Vérifier que tous les champs sont remplis
if (
    empty(trim($nom)) ||
    empty(trim($email)) ||
    empty(trim($sujet)) ||
    empty(trim($message))
) {
    echo json_encode([
        "success" => false,
        "message" => "Veuillez remplir tous les champs."
    ]);

    exit;
}

// Préparer l'enregistrement du message
$requete = $connexion->prepare(
    "INSERT INTO message_contact
    (nom, email, sujet, message)
    VALUES
    (:nom, :email, :sujet, :message)"
);

// Enregistrer le message dans MariaDB
$requete->execute([
    "nom" => $nom,
    "email" => $email,
    "sujet" => $sujet,
    "message" => $message
]);

// Réponse envoyée à JavaScript
echo json_encode([
    "success" => true,
    "message" => "Votre message a bien été envoyé."
]);
?>