<?php

require_once "connexion.php";

// Récupérer les données envoyées par JavaScript
$nom = $_POST["nom"];
$email = $_POST["email"];
$motDePasse = $_POST["mot_de_passe"];

// Vérifier si l'email existe déjà
$verification = $connexion->prepare(
    "SELECT id_client FROM client
     WHERE email = :email"
);

$verification->execute([
    "email" => $email
]);

$clientExistant = $verification->fetch(PDO::FETCH_ASSOC);

if ($clientExistant) {

    echo "Email déjà utilisé";
    exit;
}

// Sécuriser le mot de passe
$motDePasseHash = password_hash($motDePasse, PASSWORD_DEFAULT);

// Préparer l'ajout du client
$requete = $connexion->prepare(
    "INSERT INTO client (nom, email, mot_de_passe)
     VALUES (:nom, :email, :mot_de_passe)"
);

// Enregistrer le client dans MariaDB
$requete->execute([
    "nom" => $nom,
    "email" => $email,
    "mot_de_passe" => $motDePasseHash
]);

echo "Compte créé";

?>