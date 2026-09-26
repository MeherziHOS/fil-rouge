<?php

session_start();
require_once "connexion.php";

// Récupérer les données envoyées par JavaScript
$email = $_POST["email"];
$motDePasse = $_POST["mot_de_passe"];

// Chercher le client grâce à son email
$requete = $connexion->prepare(
    "SELECT * FROM client
     WHERE email = :email"
);

$requete->execute([
    "email" => $email
]);

$client = $requete->fetch(PDO::FETCH_ASSOC);

// Vérifier le client et son mot de passe
if ($client && password_verify($motDePasse, $client["mot_de_passe"])) {
$_SESSION["id_client"] = $client["id_client"];
$_SESSION["nom_client"] = $client["nom"];
$_SESSION["role"] = $client["role"];

echo "Connexion réussie";
    //echo "Connexion réussie";

} else {

    echo "Email ou mot de passe incorrect";

}

?>