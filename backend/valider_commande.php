<?php

session_start();

require_once "connexion.php";

header("Content-Type: application/json");

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


// Vérifier qu'un client est connecté
if (!isset($_SESSION["id_client"])) {

    echo json_encode([
        "success" => false,
        "message" => "Vous devez être connecté pour commander."
    ]);

    exit;
}

$idClient = $_SESSION["id_client"];


try {

    // Commencer la transaction
    $connexion->beginTransaction();


    // Vérifier le stock réel
    foreach ($commande["produits"] as $produit) {

        $requeteStock = $connexion->prepare(
            "SELECT prix, stock
            FROM produit
            WHERE id_produit = :id_produit
            FOR UPDATE"
        );

        $requeteStock->execute([
            "id_produit" => $produit["id_produit"]
        ]);

        $produitBase = $requeteStock->fetch(PDO::FETCH_ASSOC);
        $produit["prix"] = $produitBase["prix"];

        if (
            !$produitBase ||
            $produit["quantite"] <= 0 ||
            $produit["quantite"] > $produitBase["stock"]
        ) {
            throw new Exception(
                "Stock insuffisant pour un produit."
            );
        }
    }


    // Créer la commande
    $requeteCommande = $connexion->prepare(
        "INSERT INTO commande
        (date_commande, id_client)
        VALUES
        (NOW(), :id_client)"
    );

    $requeteCommande->execute([
        "id_client" => $idClient
    ]);

    $idCommande = $connexion->lastInsertId();


    // Enregistrer les produits
    foreach ($commande["produits"] as $produit) {
// Récupérer le vrai prix depuis MariaDB
$requetePrix = $connexion->prepare(
    "SELECT prix
     FROM produit
     WHERE id_produit = :id_produit"
);

$requetePrix->execute([
    "id_produit" => $produit["id_produit"]
]);

$produitBase = $requetePrix->fetch(PDO::FETCH_ASSOC);
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
            "prix" => $produitBase["prix"]
        ]);


        // Diminuer le stock
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


    // Tout s'est bien passé
    $connexion->commit();

    echo json_encode([
        "success" => true,
        "id_commande" => $idCommande
    ]);


} catch (Throwable $erreur) {

    // Une erreur : annuler toute la commande
    if ($connexion->inTransaction()) {
        $connexion->rollBack();
    }

    echo json_encode([
        "success" => false,
        "message" => $erreur->getMessage()
    ]);
}

?>