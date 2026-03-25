import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, getDocs, collection } 
  from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Charger le panier existant ou créer un panier vide
let panier = JSON.parse(localStorage.getItem("panier")) || [];

// Fonction pour ajouter un produit au panier
function ajouterAuPanier(produit) {
  panier.push(produit);
  localStorage.setItem("panier", JSON.stringify(panier));
  alert("Produit ajouté au panier !");
}

// Charger les produits depuis Firestore
async function loadMenu() {
  const snapshot = await getDocs(collection(db, "produits"));

  const cafeDiv = document.getElementById("cafe");
  const boissonDiv = document.getElementById("boisson");
  const chichaDiv = document.getElementById("chicha");
  const autreDiv = document.getElementById("autre");

  snapshot.forEach(doc => {
    const p = doc.data();

    const card = document.createElement("div");
    card.className = "item-card";

    card.innerHTML = `
      <img src="images/${p.categorie}.jpg" class="item-img">
      <h3>${p.nom}</h3>
      <p>${p.prix} DT</p>
      <button class="btn btn-primary">Ajouter</button>
    `;

    card.querySelector("button").addEventListener("click", () => {
      ajouterAuPanier({
        nom: p.nom,
        prix: p.prix
      });
    });

    if (p.categorie === "cafe") cafeDiv.appendChild(card);
    if (p.categorie === "boisson") boissonDiv.appendChild(card);
    if (p.categorie === "chicha") chichaDiv.appendChild(card);
    if (p.categorie === "autre") autreDiv.appendChild(card);
  });
}

loadMenu();
