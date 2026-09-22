<?php

require_once "connexion.php";//utilise le fichier connexion.php

$requete = $connexion->query("SELECT * FROM produit");//query(...) → exécute notre SELECT

$produits = $requete->fetchAll(PDO::FETCH_ASSOC);//fetchAll(...)→ récupère tous les produits trouvés
//$produits→ contient maintenant les produits de la base

header("Content-Type: application/json");

echo json_encode($produits);
?>