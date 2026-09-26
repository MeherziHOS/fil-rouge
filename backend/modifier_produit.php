<?php

require_once "verifier_admin.php";
require_once "connexion.php";

// Récupérer les informations envoyées par JavaScript
$id = $_POST["id"];
$nom = $_POST["nom"];
$prix = $_POST["prix"];
$stock = $_POST["stock"];

// Préparer la modification du produit
$requete = $connexion->prepare(
    "UPDATE produit
     SET nom = :nom, prix = :prix, stock = :stock
     WHERE id_produit = :id"
);

// Exécuter la modification
$requete->execute([
    "nom" => $nom,
    "prix" => $prix,
    "stock" => $stock,
    "id" => $id
]);

?>