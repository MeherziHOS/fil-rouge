<?php
session_start();

require_once "connexion.php";

// Récupérer le JSON envoyé par JavaScript
$json = file_get_contents("php://input");

// Transformer le JSON en tableau PHP
$commande = json_decode($json, true);

// Créer une nouvelle commande dans MariaDB
$requete = $connexion->prepare(
    "INSERT INTO commande (date_commande, id_client)
 VALUES (NOW(), :id_client)"
);

$idClient = $_SESSION["id_client"] ?? null;

$requete->execute([
    "id_client" => $idClient
]);

// Récupérer l'identifiant de la nouvelle commande
$idCommande = $connexion->lastInsertId();

// Enregistrer les produits de la commande
foreach ($commande["produits"] as $produit) {

    $requeteLigne = $connexion->prepare(
        "INSERT INTO ligne_commande
        (id_commande, id_produit, quantite, prix)
        VALUES
        (:id_commande, :id_produit, :quantite, :prix)"
    );

    $requeteLigne->execute([
        "id_commande" => $idCommande,
        "id_produit" => $produit["id_produit"],
        "quantite" => $produit["quantite"],
        "prix" => $produit["prix"]
    ]);

    // Diminuer réellement le stock dans MariaDB
$requeteStock = $connexion->prepare(
    "UPDATE produit
     SET stock = stock - :quantite
     WHERE id_produit = :id_produit"
);

$requeteStock->execute([
    "quantite" => $produit["quantite"],
    "id_produit" => $produit["id_produit"]
]);
}

// Réponse envoyée à JavaScript
echo json_encode([
    "succes" => true,
    "id_commande" => $idCommande
]);

?>