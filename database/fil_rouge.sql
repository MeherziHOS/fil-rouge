CREATE TABLE produit (
    id_produit INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(100),
    prix DECIMAL(10,2),
    stock INTEGER,
    image VARCHAR(255),
    categorie VARCHAR(50)
);

INSERT INTO produit (nom, prix, stock, image, categorie) VALUES
('Clavier mécanique', 59.00, 10, 'images/clavier_mecanique.jpg', 'clavier'),
('Souris', 9.99, 40, 'images/souris_noire.jpg', 'souris'),
('Ecran 32 pouces', 129.99, 20, 'images/ecran.jpg', 'ecran'),
('Ecran 38 pouces', 169.99, 10, 'images/ecran_38.jpg', 'ecran'),
('Clavier Lumineux', 49.99, 20, 'images/clavier_lumineux.jpg', 'clavier'),
('Clavier Gaming', 89.99, 15, 'images/clavier_gaming.jpg', 'clavier'),
('Tapis Souris', 8.99, 40, 'images/tapis_souris.jpg', 'souris'),
('Casque Gaming', 69.99, 10, 'images/casque_gaming.jpg', 'accessoire'),
('Cable HDMI', 7.99, 40, 'images/cable_hdmi.jpg', 'accessoire');

CREATE TABLE client (
    id_client INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(100),
    email VARCHAR(150) UNIQUE,
    mot_de_passe VARCHAR(255),
    role VARCHAR(20) NOT NULL DEFAULT 'client'
);

INSERT INTO client (nom, email, mot_de_passe, role) VALUES
(
    'Test',
    'test@test.fr',
    '$2y$10$YOECJAmDB4LVvWMEBEIoAus2S9jQMqdx/6R2TIndkn8QTZFt1m3ny',
    'admin'
),
(
    'Client 3',
    'client3@test.fr',
    '$2y$10$PLVt.Tnp6234RuMEoGKgdeiiEvP0jy8xYKZ9tuAsxxfA6lolQv7pW',
    'client'
);s

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

CREATE TABLE message_contact (
    id_message INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    sujet VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    date_message DATETIME DEFAULT CURRENT_TIMESTAMP
);