import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, addDoc, collection } 
  from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.getElementById("valider").addEventListener("click", envoyerCommande);

async function envoyerCommande() {

  const nom = document.getElementById("nom").value;
  const table = document.getElementById("table").value;

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  let total = 0;
  cart.forEach(item => total += item.prix);

  if (!nom || !table || cart.length === 0) {
    alert("Veuillez remplir le nom, la table et ajouter des produits.");
    return;
  }

  await addDoc(collection(db, "commandes"), {
    nom: nom,
    table: table,
    panier: cart,
    total: total,
    date: new Date()
  });

  alert("Commande envoyée !");
  localStorage.removeItem("cart");
  window.location.href = "index.html";
}
