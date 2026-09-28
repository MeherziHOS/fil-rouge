export class Produit {

    #quantite;

    constructor(id_produit, nom, prix, stock, quantite) {

        this.id_produit = id_produit;
        this.nom = nom;
        this.prix = prix;
        this.stock = stock;
        this.#quantite = quantite;

        this.resultat = prix * quantite;
    }

    get quantite() {
        return this.#quantite;
    }

    calculerResultat() {
        this.resultat = this.prix * this.#quantite;
    }

    augmenterQuantite() {

        if (this.#quantite < this.stock) {
            this.#quantite = this.#quantite + 1;
            this.calculerResultat();
        }
    }

    diminuerQuantite() {

        if (this.#quantite > 1) {
            this.#quantite = this.#quantite - 1;
            this.calculerResultat();
        }
    }
}