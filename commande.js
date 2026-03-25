import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, addDoc, collection, Timestamp } 
  from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Charger le panier
let panier = JSON.parse(localStorage.getItem("panier")) || [];

const panierDiv = document.getElementById("panier");
const totalDiv = document.getElementById("total");

// Afficher le panier
function afficherPanier() {
  panierDiv.innerHTML = "";
  let total = 0;

  panier.forEach(item => {
    panierDiv.innerHTML += `
      <p>${item.nom} — ${item.prix} DT</p>
    `;
    total += item.prix;
  });

  totalDiv.textContent = total + " DT";
}

afficherPanier();

// Envoyer la commande
document.getElementById("envoyer").addEventListener("click", async () => {
  const nom = document.getElementById("nom").value;
  const table = document.getElementById("table").value;

  if (!nom || !table || panier.length === 0) {
    alert("Veuillez remplir tous les champs et ajouter des produits.");
    return;
  }

  await addDoc(collection(db, "commandes"), {
    nom,
    table,
    panier,
    total: panier.reduce((t, p) => t + p.prix, 0),
    date: Timestamp.now()
  });

  alert("Commande envoyée !");
  localStorage.removeItem("panier");
  window.location.reload();
});
