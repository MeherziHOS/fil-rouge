import { Produit } from "./Produit.js";

//============
//1. Données
//============

// Catalogue principal : tous les produits disponibles à la vente
let catalogue = [];

// Récupération des produits depuis la base de données MariaDB
function chargerCatalogue() {

    fetch("backend/produits.php")
        .then(response => response.json())
        .then(data => {

            catalogue = data;

            afficherCatalogue(catalogue);
            afficherProduitsAdmin(catalogue);
        });

}

chargerCatalogue();

// Panier actuel du client
let produits = [];

// Total actuel du panier
let total = 0;

// Permet de savoir quel produit du catalogue est en cours de modification
// null = aucun produit en cours de modification
let indexModification = null;

//==================
//2. Elément du DOM
//==================
let formContact = document.getElementById("formContact");
let messageContact = document.getElementById("messageContact");

// Champs du formulaire "Gestion des produits"
let champNom = document.getElementById("nomProduit");
let champPrix = document.getElementById("prixProduit");
let champStock = document.getElementById("stockProduit");

// Zone d'erreur du formulaire
let zoneErreur = document.getElementById("messageErreur");

// Boutons principaux
let boutonAjouter = document.getElementById("btnAjouter");
let boutonAnnuler = document.getElementById("btnAnnuler");
let boutonValiderCommande = document.getElementById("btnValiderCommande");

// Zones d'affichage du panier
let zonePanier = document.getElementById("panier");
let badgePanier = document.getElementById("badgePanier");
let zoneTotal = document.getElementById("totalPanier");
let zoneReduction = document.getElementById("reductionPanier");
let zoneTotalAPayer = document.getElementById("totalAPayer");

// Catalogue
let zoneCatalogue = document.getElementById("catalogue");
let rechercheProduit = document.getElementById("rechercheProduit");
let boutonRecherche = document.getElementById("btnRecherche");
let boutonsFiltres = document.querySelectorAll(".filtre-produit");

// Message affiché après validation d'une commande
let zoneMessageCommande = document.getElementById("messageCommande");
// Historique des commandes
let zoneHistorique = document.getElementById("historiqueCommandes");
let zoneMessagesContactAdmin = document.getElementById("messagesContactAdmin");
// Formulaire d'inscription
let inscriptionNom = document.getElementById("inscriptionNom");
let inscriptionEmail = document.getElementById("inscriptionEmail");
let inscriptionMotDePasse = document.getElementById("inscriptionMotDePasse");

let boutonInscription = document.getElementById("btnInscription");
let messageInscription = document.getElementById("messageInscription");

// Formulaire de connexion
let connexionEmail = document.getElementById("connexionEmail");
let connexionMotDePasse = document.getElementById("connexionMotDePasse");
let boutonConnexion = document.getElementById("btnConnexion");

// Zone Mes commandes du client
let zoneMesCommandesClient = document.getElementById("mesCommandesClient");

let zoneClientConnecte = document.getElementById("clientConnecte");

let messageConnexion = document.getElementById("messageConnexion");

let formulairesCompte = document.getElementById("formulairesCompte");

let sectionAdmin = document.getElementById("sectionAdmin");
let categorieProduit = document.getElementById("categorieProduit");


sectionAdmin.style.display = "none";

function verifierClientConnecte() {

    fetch("backend/verifier_session.php")
        .then(response => response.json())
        .then(data => {

            if (data.connecte === true) {

                if (data.role === "admin") {
                    sectionAdmin.style.display = "block";
                    chargerMessagesContact();
                }

                formulairesCompte.style.display = "none";
                zoneClientConnecte.innerHTML =
                    "<p>Bonjour " + data.nom + "</p>" +
                    "<button id='btnDeconnexion'>Se déconnecter</button>";

                let boutonDeconnexion =
                    document.getElementById("btnDeconnexion");

                boutonDeconnexion.addEventListener("click", function () {

                    fetch("backend/deconnexion.php")
                        .then(response => response.text())
                        .then(data => {
                            window.location.href = window.location.pathname + "#compte";
                            window.location.reload();
                        });

                });
            }

        });
}

verifierClientConnecte();

// Charger les commandes du client connecté
function chargerMesCommandes() {

    fetch("backend/mes_commandes.php")
        .then(response => response.json())
        .then(data => {

            zoneMesCommandesClient.innerHTML = "";

            // Regrouper les produits par commande
            let commandesGroupees = {};

            for (let i = 0; i < data.length; i++) {

                let idCommande = data[i].id_commande;

                if (commandesGroupees[idCommande] === undefined) {

                    commandesGroupees[idCommande] = {
                        date: data[i].date_commande,
                        produits: []
                    };
                }

                commandesGroupees[idCommande].produits.push({
                    nom: data[i].nom,
                    quantite: data[i].quantite,
                    prix: data[i].prix
                });
            }


            // Afficher chaque commande
            for (let idCommande in commandesGroupees) {

                let commande = commandesGroupees[idCommande];
                let dateCommande = new Date(commande.date);

                let dateFormatee = dateCommande.toLocaleString("fr-FR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                });
                let htmlProduits = "";
                let totalCommande = 0;

                for (let i = 0; i < commande.produits.length; i++) {

                    totalCommande =
                        totalCommande +
                        commande.produits[i].prix *
                        commande.produits[i].quantite;

                    htmlProduits =
                        htmlProduits +
                        "<div class='ligne-commande-client'>" +
                        commande.produits[i].nom +
                        " × " +
                        commande.produits[i].quantite +
                        " — " +
                        commande.produits[i].prix +
                        " €" +
                        "</div>";
                }

                zoneMesCommandesClient.innerHTML +=
                    "<div class='commande-client'>" +

                    "<strong>Commande n°" +
                    idCommande +
                    "</strong>" +

                    "<span>Date : " +
                    dateFormatee +
                    "</span>" +

                    htmlProduits +

                    "<strong>Total : " +
                    totalCommande.toFixed(2) +
                    " €</strong>" +

                    "</div>";
            }

        });
}
chargerMesCommandes();

// Clic sur Se connecter
boutonConnexion.addEventListener("click", function () {
    messageConnexion.textContent = "";
    let donnees = new FormData();

    donnees.append("email", connexionEmail.value);
    donnees.append("mot_de_passe", connexionMotDePasse.value);

    fetch("backend/connexion_client.php", {
        method: "POST",
        body: donnees,
        credentials: "same-origin"
    })
        .then(response => response.text())
        .then(data => {
            if (data === "Connexion réussie") {

                location.reload();

            } else {

                messageConnexion.textContent = data;

            }

        });

});

// Clic sur Créer mon compte
boutonInscription.addEventListener("click", function () {
    messageInscription.textContent = "";
    // Vérifier que tous les champs sont remplis
    if (
        inscriptionNom.value.trim() === "" ||
        inscriptionEmail.value.trim() === "" ||
        inscriptionMotDePasse.value.trim() === ""
    ) {
        messageInscription.textContent =
            "Veuillez remplir tous les champs.";

        return;
    }
    // Vérifier le format de l'email
    if (!inscriptionEmail.value.includes("@")) {

        messageInscription.textContent =
            "Adresse email invalide.";

        return;
    }
    // Vérifier la longueur du mot de passe
    if (inscriptionMotDePasse.value.length < 8) {

        messageInscription.textContent =
            "Le mot de passe doit contenir au moins 8 caractères.";

        return;
    }
    let donnees = new FormData();

    donnees.append("nom", inscriptionNom.value);
    donnees.append("email", inscriptionEmail.value);
    donnees.append("mot_de_passe", inscriptionMotDePasse.value);

    fetch("backend/inscription.php", {
        method: "POST",
        body: donnees
    })
        .then(response => response.text())
        .then(data => {
            messageInscription.textContent = data;

            if (data.trim() === "Compte créé") {
                inscriptionNom.value = "";
                inscriptionEmail.value = "";
                inscriptionMotDePasse.value = "";
            }
        });
});

// Charger l'historique des commandes depuis MariaDB
function chargerHistoriqueCommandes() {

    fetch("backend/historique_commandes.php")
        .then(response => response.json())
        .then(data => {
            // Vider l'ancien historique
            zoneHistorique.innerHTML = "";

            // Regrouper les produits par commande
            let commandesGroupees = {};

            for (let i = 0; i < data.length; i++) {

                let idCommande = data[i].id_commande;

                // Créer la commande si elle n'existe pas encore
                if (commandesGroupees[idCommande] === undefined) {

                    commandesGroupees[idCommande] = {
                        date: data[i].date_commande,
                        produits: []
                    };
                }

                // Ajouter le produit dans la commande
                commandesGroupees[idCommande].produits.push({
                    nom: data[i].nom,
                    quantite: data[i].quantite,
                    prix: data[i].prix
                });
            }


            // Afficher les commandes regroupées
            for (let idCommande in commandesGroupees) {

                let commande = commandesGroupees[idCommande];
                let htmlProduits = "";
                let totalCommande = 0;

                // Construire la liste des produits
                for (let i = 0; i < commande.produits.length; i++) {

                    totalCommande =
                        totalCommande +
                        commande.produits[i].prix *
                        commande.produits[i].quantite;

                    htmlProduits =
                        htmlProduits +
                        "<div class='ligne-historique'>" +
                        commande.produits[i].nom +
                        " × " +
                        commande.produits[i].quantite +
                        " — " +
                        commande.produits[i].prix +
                        " €" +
                        "</div>";
                }

                // Construire une seule carte par commande
                zoneHistorique.innerHTML =
                    zoneHistorique.innerHTML +
                    "<div class='commande-historique'>" +
                    "<strong>Commande n°" +
                    idCommande +
                    "</strong>" +
                    "<span>Date : " +
                    commande.date +
                    "</span>" +
                    htmlProduits +
                    "<strong>Total : " +
                    totalCommande.toFixed(2) +
                    " €</strong>" +
                    "</div>";
            }

        });
}

chargerHistoriqueCommandes();

// Charger les messages de contact dans l'espace administrateur
function chargerMessagesContact() {

    fetch("backend/messages_contact.php")
        .then(response => response.json())
        .then(messages => {

            // Vider l'ancien affichage
            zoneMessagesContactAdmin.innerHTML = "";

            // Parcourir tous les messages
            for (let i = 0; i < messages.length; i++) {

                let message = messages[i];

                zoneMessagesContactAdmin.innerHTML +=
                    "<div class='message-contact-admin'>" +
                    "<h4>" + message.sujet + "</h4>" +
                    "<p><strong>De :</strong> " + message.nom + "</p>" +
                    "<p><strong>Email :</strong> " + message.email + "</p>" +
                    "<p><strong>Date :</strong> " + message.date_message + "</p>" +
                    "<p>" + message.message + "</p>" +
                    "</div>";
            }

        });
} +

    // RECHERCHER UN PRODUIT
    rechercheProduit.addEventListener("input", function () {

        // Récupérer le texte écrit par l'utilisateur
        let texteRecherche = rechercheProduit.value.toLowerCase();

        // Tableau qui contiendra les produits trouvés
        let produitsFiltres = [];

        // Parcourir le catalogue
        for (let i = 0; i < catalogue.length; i++) {

            // Récupérer le nom du produit en minuscules
            let nomProduit = catalogue[i].nom.toLowerCase();

            // Vérifier si le nom contient le texte recherché
            if (nomProduit.includes(texteRecherche)) {

                produitsFiltres.push(catalogue[i]);
            }
        }

        // Afficher uniquement les produits trouvés
        afficherCatalogue(produitsFiltres);
    });
// CLIC SUR LA LOUPE DU HEADER
boutonRecherche.addEventListener("click", function (event) {

    // Empêcher le comportement automatique du lien
    event.preventDefault();

    // Aller jusqu'à la barre de recherche
    rechercheProduit.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

    // Placer le curseur dans le champ
    rechercheProduit.focus({
        preventScroll: true
    });

});

// FILTRER LES PRODUITS PAR CATÉGORIE
for (let i = 0; i < boutonsFiltres.length; i++) {

    boutonsFiltres[i].addEventListener("click", function () {

        let categorie = boutonsFiltres[i].dataset.categorie;

        // Si l'utilisateur clique sur "Tous"
        if (categorie === "tous") {

            afficherCatalogue(catalogue);

        } else {

            let produitsFiltres = [];

            // Parcourir tous les produits
            for (let j = 0; j < catalogue.length; j++) {

                if (catalogue[j].categorie === categorie) {
                    produitsFiltres.push(catalogue[j]);
                }
            }

            // Afficher les produits trouvés
            afficherCatalogue(produitsFiltres);
        }

    });
}

//======================
//3. Fonctions de calcul
//======================

// Calcule le sous-total d'un produit
function calculerProduit(prix, quantite) {
    let resultat = prix * quantite;
    return resultat;
}

// Calcule le montant final après déduction de la réduction
function calculerReduction(total, reduction) {

    let resultat = total - reduction;

    return resultat;
}

// Détermine la réduction selon le montant total du panier
function obtenirReduction(total) {

    if (total >= 200) {
        return 30;

    } else if (total >= 100) {
        return 10;

    } else {
        return 0;
    }
}

// Additionne les sous-totaux de tous les produits du panier
function recalculerTotal(produits) {

    let nouveauTotal = 0;

    for (let i = 0; i < produits.length; i++) {
        nouveauTotal = nouveauTotal + produits[i].resultat;
    }
    return nouveauTotal;
}


//========================
//4. Fonctions d'Affichage
//========================
function afficherCatalogue(catalogue) {

    // Vider le catalogue avant de le reconstruire
    zoneCatalogue.innerHTML = "";

    // AFFICHAGE DES PRODUITS DU CATALOGUE
    for (let i = 0; i < catalogue.length; i++) {

        // Préparer l'image uniquement si elle existe
        let htmlImage = "";

        if (catalogue[i].image !== null && catalogue[i].image !== "") {

            htmlImage =
                "<img class='image-produit' src='" +
                catalogue[i].image +
                "' alt='" +
                catalogue[i].nom +
                "'>";
        }

        // Créer une carte HTML pour chaque produit
        zoneCatalogue.innerHTML =
            zoneCatalogue.innerHTML +
            "<div class='produit-catalogue'>" +

            htmlImage +

            "<strong>" +
            catalogue[i].nom +
            "</strong>" +

            "<span class='prix-produit'>Prix : " +
            catalogue[i].prix +
            "€</span>" +

            "<span>Stock disponible : " +
            catalogue[i].stock +
            "</span>" +

            "<button class='btn-modifier-catalogue' data-index='" +
            i +
            "'>Modifier</button>" +

            "<button class='btn-supprimer-catalogue' data-index='" +
            i +
            "'>Supprimer</button>" +

            "<button class='btn-ajouter-catalogue' data-index='" +
            i +
            "'>Ajouter au panier</button>" +

            "</div>";
    }

    // RÉCUPÉRATION DES BOUTONS
    let boutonsModifierCatalogue = document.querySelectorAll(".btn-modifier-catalogue");
    let boutonsSupprimerCatalogue = document.querySelectorAll(".btn-supprimer-catalogue");
    let boutonsAjouterCatalogue = document.querySelectorAll(".btn-ajouter-catalogue");

    // CLIC SUR AJOUTER AU PANIER
    for (let i = 0; i < boutonsAjouterCatalogue.length; i++) {
        boutonsAjouterCatalogue[i].addEventListener("click", function (event) {
            // Récupérer l'index du produit cliqué
            let index = event.target.dataset.index;
            // Récupérer le produit dans le catalogue
            let produitCatalogue = catalogue[index];

            let produitExiste = false;
            for (let i = 0; i < produits.length; i++) {
                if (produits[i].nom === produitCatalogue.nom) {

                    // Le produit existe déjà dans le panier
                    produitExiste = true;

                    // Augmenter seulement si la quantité est inférieure au stock
                    produits[i].augmenterQuantite();
                    break;
                }
            }

            if (produitExiste === false) {
                let quantite = 1;

                let produit = new Produit(
                    produitCatalogue.id_produit,
                    produitCatalogue.nom,
                    produitCatalogue.prix,
                    produitCatalogue.stock,
                    quantite
                );

                produits.push(produit);

            }
            // Actualiser le panier
            affichePanier(produits);
            // Actualiser total, réduction et montant à payer
            mettreAjourTotaux(produits);
        });
    }

    // CLIC SUR MODIFIER UN PRODUIT
    for (let i = 0; i < boutonsModifierCatalogue.length; i++) {
        boutonsModifierCatalogue[i].addEventListener("click", function (event) {
            let index = event.target.dataset.index;
            indexModification = Number(index);
            boutonAjouter.textContent = "Enregistrer la modification";
            let produitAModifier = catalogue[index];

            champNom.value = produitAModifier.nom;
            champPrix.value = produitAModifier.prix;
            champStock.value = produitAModifier.stock;
            categorieProduit.value = produitAModifier.categorie;


        });
    }

    // CLIC SUR SUPPRIMER UN PRODUIT
    for (let i = 0; i < boutonsSupprimerCatalogue.length; i++) {
        boutonsSupprimerCatalogue[i].addEventListener("click", function (event) {
            let index = event.target.dataset.index;

            let confirmation = confirm(
                "Voulez-vous vraiment supprimer ce produit du catalogue ?"
            );
            if (confirmation === true) {
                let nomProduitSupprime = catalogue[index].nom;
                catalogue.splice(index, 1);
                for (let j = produits.length - 1; j >= 0; j--) {
                    if (produits[j].nom === nomProduitSupprime) {
                        produits.splice(j, 1);
                    }
                }
                afficherCatalogue(catalogue);
                affichePanier(produits);
                mettreAjourTotaux(produits);
            }
        });
    }

}

function afficherProduitsAdmin(catalogue) {

    let zoneAdmin = document.getElementById("listeProduitsAdmin");

    zoneAdmin.innerHTML = "";

    for (let i = 0; i < catalogue.length; i++) {

        zoneAdmin.innerHTML =
            zoneAdmin.innerHTML +
            "<div class='produit-admin'>" +
            "<strong>" + catalogue[i].nom + "</strong>" +
            "<span>Prix : " + catalogue[i].prix + " €</span>" +
            "<span>Stock : " + catalogue[i].stock + "</span>" +
            "<button class='btn-modifier-admin' data-index='" + i + "'>Modifier</button>" +
            "<button class='btn-supprimer-admin' data-index='" + i + "'>Supprimer</button>" +
            "</div>";
    }
    // Récupérer tous les boutons Modifier de l'administration
    let boutonsModifierAdmin =
        document.querySelectorAll(".btn-modifier-admin");

    // Clic sur un bouton Modifier
    for (let i = 0; i < boutonsModifierAdmin.length; i++) {

        boutonsModifierAdmin[i].addEventListener("click", function (event) {

            // Récupérer l'index du produit sélectionné
            let index = event.target.dataset.index;

            // Mémoriser le produit en cours de modification
            indexModification = Number(index);

            // Récupérer le produit
            let produitAModifier = catalogue[indexModification];

            // Remplir automatiquement le formulaire
            champNom.value = produitAModifier.nom;
            champPrix.value = produitAModifier.prix;
            champStock.value = produitAModifier.stock;
            categorieProduit.value = produitAModifier.categorie;

            // Transformer le bouton Ajouter
            boutonAjouter.textContent = "Enregistrer la modification";

            // Afficher le bouton Annuler
            boutonAnnuler.style.display = "inline-block";
        });
    }

    // Récupérer tous les boutons Supprimer de l'administration
    let boutonsSupprimerAdmin =
        document.querySelectorAll(".btn-supprimer-admin");


    // Clic sur Supprimer
    for (let i = 0; i < boutonsSupprimerAdmin.length; i++) {

        boutonsSupprimerAdmin[i].addEventListener("click", function (event) {

            // Récupérer l'index du produit sélectionné
            let index = event.target.dataset.index;

            // Récupérer le produit
            let produitASupprimer = catalogue[index];

            // Demander confirmation
            let confirmation = confirm(
                "Voulez-vous vraiment supprimer " +
                produitASupprimer.nom +
                " ?"
            );

            if (confirmation === true) {

                // Préparer l'identifiant à envoyer à PHP
                let donnees = new FormData();

                donnees.append(
                    "id",
                    produitASupprimer.id_produit
                );

                // Demander au back-end de supprimer le produit
                fetch("backend/supprimer_produit.php", {
                    method: "POST",
                    body: donnees
                })
                    .then(() => {

                        // Recharger le catalogue depuis MariaDB
                        chargerCatalogue();

                    });
            }

        });
    }
}

// Affiche le contenu actuel du panier dans la page
function affichePanier(produits) {
    // Vider l'ancien affichage avant de reconstruire le panier
    zonePanier.innerHTML = "";
    // 1. VÉRIFIER SI LE PANIER EST VIDE

    // length donne le nombre de produits présents dans le tableau
    if (produits.length === 0) {
        // Aucun produit → afficher un message
        zonePanier.innerHTML = "Votre panier est vide .";
        // Cacher les totaux puisqu'il n'y a rien à calculer
        zoneTotal.style.display = "none";
        zoneReduction.style.display = "none";
        zoneTotalAPayer.style.display = "none";
        // Arrêter immédiatement la fonction
        return;
    }

    // Si on arrive ici, c'est que le panier contient au moins un produit
    // → réafficher les totaux
    zoneTotal.style.display = "block";
    zoneReduction.style.display = "block";
    zoneTotalAPayer.style.display = "block";

    //2. CRÉER LES CARTES DU PANIER
    // Parcourir tous les produits présents dans le panier
    for (let i = 0; i < produits.length; i++) {

        //Vérifier si le bouton -/+ doit être désactivé
        let moinsDesactive = "";
        let plusDesactive = "";

        // Si la quantité est déjà à 1,
        // empêcher l'utilisateur de descendre à 0
        if (produits[i].quantite === 1) {
            moinsDesactive = "disabled";
        }

        if (produits[i].quantite >= produits[i].stock) {
            plusDesactive = "disabled";
        }

        //Création des cartes
        zonePanier.innerHTML = zonePanier.innerHTML + "<div class='produit-panier'>" +
            "<strong>" + produits[i].nom + "</strong>" +
            "<span> - Prix : " + produits[i].prix + " €</span>" +
            "<span> - Quantité : " + produits[i].quantite + "</span>" +

            "<button class='btn-moins' data-index='" + i + "' " + moinsDesactive + ">-</button>" +
            "<button class='btn-plus' data-index='" + i + "' " + plusDesactive + ">+</button>" +

            "<span> - Sous-total : " + produits[i].resultat + " €</span>" +

            "<button class='btn-supprimer' data-index='" + i + "'>Supprimer</button>" +
            "</div>"
    }

    // 3. RÉCUPÉRER LES BOUTONS CRÉÉS
    // querySelectorAll récupère TOUS les boutons correspondant
    // à chaque classe CSS
    let boutonPlus = document.querySelectorAll(".btn-plus");
    let boutonMoins = document.querySelectorAll(".btn-moins");
    let boutonSupprimer = document.querySelectorAll(".btn-supprimer");

    // 4. BOUTON +
    // Parcourir tous les boutons +
    for (let i = 0; i < boutonPlus.length; i++) {
        // Attendre un clic sur chaque bouton +
        boutonPlus[i].addEventListener("click", function (event) {
            // Récupérer l'index stocké dans data-index
            // Cela permet de savoir QUEL produit a été cliqué
            let index = event.target.dataset.index;
            // Vérifier qu'on ne dépasse pas le stock disponible
            if (produits[index].quantite < produits[index].stock) {
                produits[index].augmenterQuantite();
                // Reconstruire le panier avec les nouvelles valeurs
                affichePanier(produits);
                // Recalculer Total / Réduction / À payer
                mettreAjourTotaux(produits);
            }
        });

    }
    //5. BOUTON -
    // Parcourir tous les boutons -
    for (let i = 0; i < boutonMoins.length; i++) {
        boutonMoins[i].addEventListener("click", function (event) {
            // Identifier le produit concerné
            let index = event.target.dataset.index;

            // Autoriser la diminution seulement au-dessus de 1
            if (produits[index].quantite > 1) {
                produits[index].diminuerQuantite();

                affichePanier(produits);
                mettreAjourTotaux(produits);
            }
        });
    }

    //6. BOUTON SUPPRIMER
    // Parcourir tous les boutons Supprimer
    for (let i = 0; i < boutonSupprimer.length; i++) {
        boutonSupprimer[i].addEventListener("click", function (event) {
            // Identifier le produit à supprimer
            let index = event.target.dataset.index;
            // Demander confirmation avant la suppression
            let confirmation = confirm(
                "Voulez-vous vraiment supprimer ce produit ?"
            );
            // OK dans confirm() renvoie true
            if (confirmation === true) {
                // Supprimer 1 élément du tableau à partir de son index
                produits.splice(index, 1);
                // Reconstruire le panier après suppression
                affichePanier(produits);
                mettreAjourTotaux(produits);
            }
        });
    }
}

// Affiche dans la page toutes les commandes déjà validées
function afficherCommandes(commandes) {
    // Vider l'ancien historique avant de le reconstruire
    // Cela évite d'afficher plusieurs fois les mêmes commandes
    zoneHistorique.innerHTML = "";

    //Parcourir toutes les commandes
    for (let i = 0; i < commandes.length; i++) {

        // Cette variable va contenir le HTML
        // de tous les produits de CETTE commande
        let listeProduits = "";

        //Parcourir les produits de cette commande
        for (let j = 0; j < commandes[i].produits.length; j++) {
            listeProduits =
                listeProduits +
                "<p>" +
                commandes[i].produits[j].nom +
                " - Quantité : " +
                commandes[i].produits[j].quantite +
                "</p>";
        }

        //Afficher la commande
        zoneHistorique.innerHTML =
            zoneHistorique.innerHTML +
            "<div class='commande-historique'>" +

            "<strong>Commande " + (i + 1) + "</strong>" +

            "<span> - Date : " + commandes[i].date + "</span>" +

            listeProduits +

            "<span> - Total : " +
            commandes[i].total +
            "€</span>" +

            "<span> - Réduction : " +
            commandes[i].reduction +
            "€</span>" +

            "<span> - À payer : " +
            commandes[i].montantAPayer +
            "€</span>" +

            "</div>";
    }
}

// Recalcule et affiche tous les montants du panier
function mettreAjourTotaux(produits) {
    // 1. CALCULER LE TOTAL
    total = recalculerTotal(produits);
    zoneTotal.textContent = "Total : " + total + "€";
    // 2. CALCULER LA RÉDUCTION
    let reduction = obtenirReduction(total);
    // 3. CALCULER LE MONTANT À PAYER
    let totalAPayer = calculerReduction(total, reduction);
    // 4. AFFICHER LES RÉSULTATS
    zoneReduction.textContent = " Réduction : " + reduction + "€";
    zoneTotalAPayer.textContent = "À payer : " + totalAPayer + "€";
    // 5. METTRE À JOUR LE COMPTEUR DU PANIER
    let quantiteTotale = 0;

    for (let i = 0; i < produits.length; i++) {
        quantiteTotale = quantiteTotale + produits[i].quantite;
    }

    badgePanier.textContent = quantiteTotale;
}



//================================
//5. Programme principal (Evénements)
//================================
affichePanier(produits);

// AJOUTER OU MODIFIER UN PRODUIT
boutonAjouter.addEventListener("click", function () {
    // Récupérer les valeurs du formulaire
    // trim() enlève les espaces inutiles autour du nom
    let nom = champNom.value.trim();
    // Les valeurs des input arrivent sous forme de texte
    // Number() les transforme en nombres
    let prix = Number(champPrix.value);
    let stock = Number(champStock.value);
    let categorie = categorieProduit.value;
    // Vérifier que le nom n'est pas vide
    if (nom === "") {
        zoneErreur.textContent = "Veuillez entrer un nom de produit !"
        return;
    }
    // Vérifier que le prix est un nombre supérieur à 0
    if (isNaN(prix) || prix <= 0) {
        zoneErreur.textContent = "Veuillez entrer un prix valide !";
        return;
    }
    // Le stock peut être 0 (rupture de stock),
    // mais jamais négatif
    if (isNaN(stock) || stock < 0) {
        zoneErreur.textContent = "Veuillez entrer un stock valide !";
        return;
    }

    if (categorie === "") {
        zoneErreur.textContent = "Veuillez choisir une catégorie !";
        return;
    }

    // Créer l'objet produit avec les valeurs validées
    let produit = {
        nom: nom,
        prix: prix,
        stock: stock
    };
    // null = aucun produit en cours de modification
    // donc on AJOUTE un nouveau produit
    if (indexModification === null) {
        // Préparer les données du nouveau produit
        let donnees = new FormData();

        donnees.append("nom", nom);
        donnees.append("prix", prix);
        donnees.append("stock", stock);
        donnees.append("categorie", categorie);

        // Envoyer les données au back-end
        fetch("backend/ajouter_produit.php", {
            method: "POST",
            body: donnees
        })
            .then(() => {
                chargerCatalogue();
            });
    } else {
        // Récupérer le produit actuellement sélectionné
        let produitAModifier = catalogue[indexModification];

        // Préparer les données à envoyer à PHP
        let donnees = new FormData();

        donnees.append("id", produitAModifier.id_produit);
        donnees.append("nom", nom);
        donnees.append("prix", prix);
        donnees.append("stock", stock);
        donnees.append("categorie", categorie);

        // Envoyer la modification à MariaDB
        fetch("backend/modifier_produit.php", {
            method: "POST",
            body: donnees
        })
            .then(() => {
                chargerCatalogue();
            });
        // Quitter le mode modification
        indexModification = null;
        boutonAjouter.textContent = "Ajouter le produit";

        boutonAnnuler.style.display = "none";
    }

    // Reconstruire le catalogue avec les nouvelles données
    // Vider le formulaire
    champNom.value = "";
    champPrix.value = "";
    champStock.value = "";
    categorieProduit.value = "";
});

// ANNULER UNE MODIFICATION
boutonAnnuler.addEventListener("click", function () {
    // Quitter le mode modification
    indexModification = null;
    // Remettre le formulaire en mode ajout
    boutonAjouter.textContent = "Ajouter le produit";
    // Vider les champs du formulaire
    champNom.value = "";
    champPrix.value = "";
    champStock.value = "";
    // Effacer un éventuel message d'erreur
    zoneErreur.textContent = "";
    // Cacher le bouton Annuler
    boutonAnnuler.style.display = "none";
});

boutonValiderCommande.addEventListener("click", function () {

    //Vérifier si le panier est vide
    if (produits.length === 0) {
        zoneErreur.textContent = "Votre panier est vide";
        return;
    }

    //Vérifier le stock
    for (let i = 0; i < produits.length; i++) {
        if (produits[i].quantite > produits[i].stock) {
            zoneErreur.textContent = "Stock insuffisant pour : " + produits[i].nom;
            return;
        }
    }

    let totalCommande = recalculerTotal(produits);
    let reductionCommande = obtenirReduction(totalCommande);
    let montantAPayer = calculerReduction(
        totalCommande,
        reductionCommande
    );

    let maintenant = new Date();

    let commande = {
        produits: [...produits],
        total: totalCommande,
        reduction: reductionCommande,
        montantAPayer: montantAPayer,

        date: maintenant.toLocaleString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        })
    };

    // Préparer les données de la commande pour PHP
    let donneesCommande = {
        produits: commande.produits.map(function (produit) {
            return {
                id_produit: produit.id_produit,
                nom: produit.nom,
                prix: produit.prix,
                stock: produit.stock,
                quantite: produit.quantite
            };
        }),
        total: commande.total,
        reduction: commande.reduction,
        montantAPayer: commande.montantAPayer
    };
    // Envoyer la commande au back-end
    fetch("backend/valider_commande.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(donneesCommande)
    })
        .then(response => response.json())
        .then(data => {

            if (data.success === false) {
                zoneMessageCommande.textContent = data.message;
                return;
            }

            // Diminuer le stock
            for (let i = 0; i < commande.produits.length; i++) {

                for (let j = 0; j < catalogue.length; j++) {

                    if (commande.produits[i].nom === catalogue[j].nom) {

                        catalogue[j].stock =
                            catalogue[j].stock -
                            commande.produits[i].quantite;

                        break;
                    }
                }
            }

            // Rafraîchir le catalogue
            afficherCatalogue(catalogue);

            // Message de confirmation
            zoneMessageCommande.textContent =
                "Commande validée ! Montant à payer : " +
                commande.montantAPayer +
                "€";

            // Vider le panier
            produits.length = 0;

            affichePanier(produits);
            mettreAjourTotaux(produits);

        });
});

formContact.addEventListener("submit", function (event) {

    // Empêcher le rechargement automatique de la page
    event.preventDefault();

    let nom = document.getElementById("contactNom").value.trim();
    let email = document.getElementById("contactEmail").value.trim();
    let sujet = document.getElementById("contactSujet").value.trim();
    let message = document.getElementById("contactMessage").value.trim();

    // Vérifier que tous les champs sont remplis
    if (
        nom === "" ||
        email === "" ||
        sujet === "" ||
        message === ""
    ) {
        messageContact.textContent = "Veuillez remplir tous les champs.";
        return;
    }

    // Préparer les données du message
    let donneesContact = new FormData();

    donneesContact.append("nom", nom);
    donneesContact.append("email", email);
    donneesContact.append("sujet", sujet);
    donneesContact.append("message", message);

    // Envoyer le message au back-end
    fetch("backend/envoyer_message.php", {
        method: "POST",
        body: donneesContact
    })
        .then(response => response.json())
        .then(data => {

            messageContact.textContent = data.message;
            if (data.success === true) {
                formContact.reset();
            }

        });
});
// ==========================================
// NAVIGATION FLOTTANTE AU DÉFILEMENT
// ==========================================

let navigationPrincipale = document.querySelector(".header-principal");
let navigationFlottante = document.querySelector(".navigation-flottante");

window.addEventListener("scroll", function () {

    let positionNavbar = navigationPrincipale.getBoundingClientRect();

    // Si la navigation principale est sortie de l'écran
    if (positionNavbar.bottom < 0) {
        navigationFlottante.classList.add("visible");
    } else {
        navigationFlottante.classList.remove("visible");
    }

});