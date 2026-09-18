<?php

// Informations nécessaires pour se connecter à la base de données
$serveur = "localhost";//où se trouve MariaDB
$utilisateur = "root";//utilisateur de la base
$motDePasse = "";
$baseDeDonnees = "fil_rouge";//base que nous voulons utiliser

try {//PHP essaie de se connecter

    $connexion = new PDO(//crée la connexion avec MariaDB
        "mysql:host=$serveur;dbname=$baseDeDonnees;charset=utf8mb4",
        $utilisateur,
        $motDePasse
    );

    echo "Connexion réussie !";

} catch (PDOException $erreur) {//si la connexion échoue, récupère l'erreur

    echo "Erreur de connexion : " . $erreur->getMessage();

}
?>