<?php

session_start();

require_once "connexion.php";

// Vérifier si un client est connecté
if (!isset($_SESSION["id_client"])) {

    echo json_encode([]);
    exit;
}

$idClient = $_SESSION["id_client"];

// Récupérer uniquement les commandes du client connecté
$requete = $connexion->prepare(
    "SELECT
        commande.id_commande,
        commande.date_commande,
        produit.nom,
        ligne_commande.quantite,
        ligne_commande.prix
    FROM commande
    INNER JOIN ligne_commande
        ON commande.id_commande = ligne_commande.id_commande
    INNER JOIN produit
        ON ligne_commande.id_produit = produit.id_produit
    WHERE commande.id_client = :id_client
    ORDER BY commande.id_commande DESC"
);

$requete->execute([
    "id_client" => $idClient
]);

$commandes = $requete->fetchAll(PDO::FETCH_ASSOC);

header("Content-Type: application/json");

echo json_encode($commandes);
?>
