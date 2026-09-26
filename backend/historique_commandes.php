<?php

require_once "connexion.php";

// Récupérer les commandes avec leurs produits
$requete = $connexion->query(
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
    ORDER BY commande.id_commande DESC"
);

// Récupérer les résultats
$historique = $requete->fetchAll(PDO::FETCH_ASSOC);

// Envoyer les données à JavaScript
header("Content-Type: application/json");

echo json_encode($historique);

?>