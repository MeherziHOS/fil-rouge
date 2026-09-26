<?php

session_start();

require_once "connexion.php";

// Récupérer le JSON envoyé par JavaScript
$json = file_get_contents("php://input");

// Transformer le JSON en tableau PHP
$commande = json_decode($json, true);


// Vérifier que la commande contient des produits
if (
    !isset($commande["produits"]) ||
    !is_array($commande["produits"]) ||
    count($commande["produits"]) === 0
) {
    echo json_encode([
        "success" => false,
        "message" => "La commande est vide."
    ]);

    exit;
}

// Vérifier le stock réel dans MariaDB
foreach ($commande["produits"] as $produit) {

    $requeteStock = $connexion->prepare(
        "SELECT stock
         FROM produit
         WHERE id_produit = :id_produit"
    );

    $requeteStock->execute([
        "id_produit" => $produit["id_produit"]
    ]);

    $produitBase = $requeteStock->fetch(PDO::FETCH_ASSOC);

    if (
        !$produitBase ||
        $produit["quantite"] > $produitBase["stock"]
    ) {
        echo json_encode([
            "success" => false,
            "message" => "Stock insuffisant pour un produit."
        ]);

        exit;
    }
}
// Vérifier qu'un client est connecté
if (!isset($_SESSION["id_client"])) {

    echo json_encode([
        "success" => false,
        "message" => "Vous devez être connecté pour commander."
    ]);

    exit;
}

$idClient = $_SESSION["id_client"];


// Créer une nouvelle commande dans MariaDB
$requete = $connexion->prepare(
    "INSERT INTO commande (date_commande, id_client)
     VALUES (NOW(), :id_client)"
);

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
    "success" => true,
    "id_commande" => $idCommande
]);

?>