<?php

require_once "connexion.php";

// Récupérer les informations envoyées par JavaScript
$nom = $_POST["nom"];
$prix = $_POST["prix"];
$stock = $_POST["stock"];

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