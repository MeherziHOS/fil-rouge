import { describe, test, expect } from "vitest";
import { Produit } from "../Produit.js";

describe("Classe Produit", () => {
    test("augmente correctement la quantité", () => {

        let produit = new Produit(
            1,
            "Souris",
            9.99,
            40,
            1
        );

        produit.augmenterQuantite();

        expect(produit.quantite).toBe(2);
        expect(produit.resultat).toBe(19.98);
    });

    test("calcule correctement le sous-total", () => {

        let produit = new Produit(
            1,
            "Souris",
            9.99,
            40,
            2
        );

        expect(produit.resultat).toBe(19.98);
    });

    test("ne dépasse pas le stock disponible", () => {

        let produit = new Produit(
            1,
            "Souris",
            9.99,
            2,
            2
        );

        produit.augmenterQuantite();

        expect(produit.quantite).toBe(2);
    });

    test("diminue correctement la quantité", () => {

        let produit = new Produit(
            1,
            "Souris",
            9.99,
            40,
            2
        );

        produit.diminuerQuantite();

        expect(produit.quantite).toBe(1);
        expect(produit.resultat).toBe(9.99);
    });

    test("ne descend pas en dessous de 1", () => {

        let produit = new Produit(
            1,
            "Souris",
            9.99,
            40,
            1
        );

        produit.diminuerQuantite();

        expect(produit.quantite).toBe(1);
        expect(produit.resultat).toBe(9.99);
    });
});