import { db } from "./firebase-config.js";
import { addDoc, collection, Timestamp } 
  from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Liste des mots interdits
const bannedWords = ["zebi", "9ahba", "fuck", "shit", "omk", "ta7ink"];

// Fonction pour vérifier les mots interdits
function contientMotBanni(texte) {
  const lower = texte.toLowerCase();
  return bannedWords.some(mot => lower.includes(mot));
}

// Charger le panier
let panier = JSON.parse(localStorage.getItem("panier")) || [];

const panierDiv = document.getElementById("panier");
const totalDiv = document.getElementById("total");

// Afficher le panier avec bouton supprimer
function afficherPanier() {
  panierDiv.innerHTML = "";
  let total = 0;

  panier.forEach((item, index) => {
    panierDiv.innerHTML += `
      <p>
        ${item.nom} — ${item.prix} DT
        <button class="btn-supprimer" data-index="${index}">
          Supprimer
        </button>
      </p>
    `;
    total += item.prix;
  });

  totalDiv.textContent = total.toFixed(3) + " DT";

  activerSuppression();
}

// Activer les boutons supprimer
function activerSuppression() {
  document.querySelectorAll(".btn-supprimer").forEach(btn => {
    btn.addEventListener("click", () => {
      const index = btn.dataset.index;
      panier.splice(index, 1);
      localStorage.setItem("panier", JSON.stringify(panier));
      afficherPanier();
    });
  });
}

afficherPanier();

// Envoyer la commande
document.getElementById("envoyer").addEventListener("click", async () => {
  const nom = document.getElementById("nom").value;
  const table = document.getElementById("table").value;
  const note = document.getElementById("note") ? document.getElementById("note").value : "";

  // Vérifier champs vides
  if (!nom || !table || panier.length === 0) {
    showNotif("⚠️ Remplis les champs et ajoute des produits !");
    return;
  }

  // Vérifier mots interdits
  if (contientMotBanni(nom) || contientMotBanni(note)) {
    showNotif("❌ Mot interdit ! Merci de rester respectueux.");
    return;
  }

  // Envoyer dans Firestore
  await addDoc(collection(db, "commandes"), {
    nom,
    table,
    note,
    panier,
    total: panier.reduce((t, p) => t + p.prix, 0),
    date: Timestamp.now()
  });

  // Message stylé 3ejaja
  showNotif("✔ ok chef, 3ejaja o tekon ba7dhak !");

  // Vider le panier immédiatement
  localStorage.removeItem("panier");
  panier = [];
  afficherPanier();

  // Supprimer automatiquement après 5 minutes côté client
  setTimeout(() => {
    localStorage.removeItem("panier");
  }, 5 * 60 * 1000); // 5 minutes
});

// 🔥 Fonction notification stylée
function showNotif(message) {
  const notif = document.getElementById("notif");
  const text = document.getElementById("notif-text");

  text.textContent = message;
  notif.classList.remove("hidden");

  setTimeout(() => {
    notif.classList.add("show");
  }, 10);

  setTimeout(() => {
    notif.classList.remove("show");
    setTimeout(() => notif.classList.add("hidden"), 400);
  }, 2500);
}
