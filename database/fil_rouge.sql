CREATE TABLE produit (
    id_produit INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(100),
    prix DECIMAL(10,2),
    stock INT
);

CREATE TABLE client (
    id_client INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(100),
    email VARCHAR(150),
    mot_de_passe VARCHAR(255)
);

CREATE TABLE commande (
    id_commande INT PRIMARY KEY AUTO_INCREMENT,
    date_commande DATETIME,
    id_client INT,
    FOREIGN KEY (id_client) REFERENCES client(id_client)
);

CREATE TABLE ligne_commande (
    id_ligne INT PRIMARY KEY AUTO_INCREMENT,
    id_commande INT,
    id_produit INT,
    quantite INT,
    prix DECIMAL(10,2),

    FOREIGN KEY (id_commande) REFERENCES commande(id_commande),
    FOREIGN KEY (id_produit) REFERENCES produit(id_produit)
);