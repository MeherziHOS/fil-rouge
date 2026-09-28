<?php

// Lire le fichier .env
$env = parse_ini_file(__DIR__ . "/../.env");

// Informations de connexion à la base de données
$serveur = $env["DB_HOST"];
$baseDeDonnees = $env["DB_NAME"];
$utilisateur = $env["DB_USER"];
$motDePasse = $env["DB_PASSWORD"];

try {//PHP essaie de se connecter

    $connexion = new PDO(//crée la connexion avec MariaDB
        "mysql:host=$serveur;dbname=$baseDeDonnees;charset=utf8mb4",
        $utilisateur,
        $motDePasse
    );

} catch (PDOException $erreur) {//si la connexion échoue, récupère l'erreur

    echo "Erreur de connexion : " . $erreur->getMessage();

}
?>