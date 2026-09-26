<?php

require_once "verifier_admin.php";
require_once "connexion.php";

// Récupérer l'identifiant envoyé par JavaScript
$id = $_POST["id"];
// Vérifier que l'identifiant est valide
if (empty($id) || !is_numeric($id)) {

    echo json_encode([
        "success" => false,
        "message" => "Identifiant du produit invalide."
    ]);

    exit;
}
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