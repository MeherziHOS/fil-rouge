<?php

require_once "verifier_admin.php";
require_once "connexion.php";

// Récupérer les informations envoyées par JavaScript
$nom = $_POST["nom"];
$prix = $_POST["prix"];
$stock = $_POST["stock"];

// Vérifier que les données sont présentes
if (
    empty(trim($nom)) ||
    $prix === null ||
    $prix <= 0 ||
    $stock === null ||
    $stock < 0
) {
    echo json_encode([
        "success" => false,
        "message" => "Données du produit invalides."
    ]);

    exit;
}
// Préparer l'ajout du produit dans la base
$requete = $connexion->prepare(
    "INSERT INTO produit (nom, prix, stock)
     VALUES (:nom, :prix, :stock)"
);

// Exécuter la requête avec les valeurs reçues
$requete->execute([
    "nom" => $nom,
    "prix" => $prix,
    "stock" => $stock
]);


?>