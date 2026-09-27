# Fil Rouge - Boutique de matériel informatique

## Présentation

Fil Rouge est une application web e-commerce de vente de matériel informatique.

Ce projet a été réalisé progressivement afin de mettre en pratique les notions de développement front-end, back-end et de base de données.

## Technologies utilisées

- HTML
- CSS
- JavaScript
- PHP
- MariaDB
- SQL
- XAMPP
- Git

## Fonctionnalités principales

- Affichage du catalogue depuis MariaDB
- Ajout de produits au panier
- Modification des quantités
- Calcul automatique du total
- Calcul des réductions
- Validation d'une commande
- Gestion du stock
- Inscription client
- Connexion et déconnexion
- Sessions utilisateur
- Historique des commandes
- Espace administrateur
- Ajout, modification et suppression de produits
- Gestion des rôles client / administrateur
- Interface responsive ordinateur, tablette et mobile

## Base de données

La base de données MariaDB contient les principales tables suivantes :

- `produit` : informations sur les produits, prix, stock et image
- `client` : informations des utilisateurs et rôle
- `commande` : commandes réalisées par les clients
- `ligne_commande` : produits et quantités associés à chaque commande

Les tables sont reliées entre elles grâce aux identifiants des clients, commandes et produits.

Les principales opérations SQL utilisées sont :

- SELECT
- INSERT
- UPDATE
- DELETE

## Sécurité

Plusieurs mécanismes de sécurité ont été mis en place :

- Mots de passe enregistrés avec un hash
- Vérification des mots de passe lors de la connexion
- Sessions PHP
- Gestion des rôles `client` et `admin`
- Protection des actions réservées à l'administrateur
- Requêtes préparées PDO
- Vérification des données côté serveur
- Vérification du stock réel dans MariaDB
- Prix récupéré directement depuis la base de données lors d'une commande
- Transactions SQL lors de la validation d'une commande

## Architecture du projet

Le projet est organisé en plusieurs parties :

### Front-end

- `index.html` : structure de la page
- `style.css` : mise en forme et responsive
- `script.js` : logique JavaScript, panier, événements et communication avec le back-end

### Back-end

Le dossier `backend` contient les fichiers PHP permettant notamment :

- la connexion à MariaDB
- l'inscription et la connexion des clients
- la gestion des sessions
- la vérification des droits administrateur
- la récupération des produits
- l'ajout, la modification et la suppression des produits
- la validation des commandes
- la récupération de l'historique des commandes

### Base de données

Le dossier `database` contient le fichier SQL permettant de conserver la structure de la base de données du projet.

### Communication entre les différentes parties

Le fonctionnement général de l'application est :

Front-end (HTML / CSS / JavaScript)
↓
Fetch
↓
Back-end (PHP)
↓
PDO
↓
MariaDB

Le navigateur n'accède donc pas directement à la base de données. Les échanges passent par le back-end PHP.

## Installation du projet

Pour utiliser le projet en local :

1. Installer et démarrer XAMPP.
2. Activer Apache et MySQL.
3. Placer le dossier `Module_1` dans le dossier `htdocs` de XAMPP.
4. Ouvrir phpMyAdmin.
5. Créer la base de données `fil_rouge`.
6. Importer le fichier `database/fil_rouge.sql`.
7. Ouvrir l'application dans le navigateur depuis `localhost/Module_1/`.

## Tests réalisés

Le projet a été testé sur différents parcours :

- inscription d'un client
- connexion et déconnexion
- distinction entre les rôles client et administrateur
- ajout de produits au panier
- modification des quantités
- validation d'une commande
- vérification et diminution du stock
- affichage des commandes du client
- historique des commandes administrateur
- ajout d'un produit
- modification d'un produit
- suppression d'un produit
- protection des fonctionnalités administrateur
- validation des données
- affichage responsive sur ordinateur, tablette et mobile

## Versionnement avec Git

Git est utilisé tout au long du développement afin de conserver l'historique des modifications du projet.

Des commits sont réalisés aux différentes étapes importantes du développement.

## État du projet

Le projet Fil Rouge dispose actuellement d'un front-end, d'un back-end PHP et d'une base de données MariaDB fonctionnels.

Les principales fonctionnalités e-commerce, l'authentification, la gestion des commandes, l'administration, la sécurité et le responsive ont été intégrés et testés.