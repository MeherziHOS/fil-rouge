<?php

require_once "connexion.php";

// Récupérer les données envoyées par JavaScript
$nom = $_POST["nom"];
$email = $_POST["email"];
$motDePasse = $_POST["mot_de_passe"];

// Vérifier que tous les champs sont remplis
if (
    empty(trim($nom)) ||
    empty(trim($email)) ||
    empty(trim($motDePasse))
) {
    echo "Veuillez remplir tous les champs.";
    exit;
}

// Vérifier l'adresse email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo "Adresse email invalide.";
    exit;
}

// Vérifier la longueur du mot de passe
if (strlen($motDePasse) < 6) {
    echo "Le mot de passe doit contenir au moins 6 caractères.";
    exit;
}

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