<?php

require_once "verifier_admin.php";
require_once "connexion.php";

// Récupérer l'identifiant envoyé par JavaScript
$id = $_POST["id"];

// Préparer la suppression
$requete = $connexion->prepare(
    "DELETE FROM produit
     WHERE id_produit = :id"
);

// Exécuter la suppression
$requete->execute([
    "id" => $id
]);
?>