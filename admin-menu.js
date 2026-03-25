import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const produitsDiv = document.getElementById("produits");
const btnAjouter = document.getElementById("ajouter");

btnAjouter.addEventListener("click", ajouterProduit);

async function ajouterProduit() {
  const nom = document.getElementById("nom").value;
  const prix = document.getElementById("prix").value;
  const categorie = document.getElementById("categorie").value.toLowerCase();

  if (!nom || !prix || !categorie) {
    alert("Veuillez remplir tous les champs.");
    return;
  }

  await addDoc(collection(db, "produits"), {
    nom,
    prix: parseFloat(prix),
    categorie
  });

  alert("Produit ajouté !");
  chargerProduits();
}

async function chargerProduits() {
  produitsDiv.innerHTML = "";

  const snapshot = await getDocs(collection(db, "produits"));

  snapshot.forEach(docSnap => {
    const p = docSnap.data();

    produitsDiv.innerHTML += `
      <div class="produit-box">
        <h3>${p.nom}</h3>
        <p>Prix : ${p.prix} DT</p>
        <p>Catégorie : ${p.categorie}</p>

        <button onclick="supprimerProduit('${docSnap.id}')">Supprimer</button>
        <button onclick="modifierProduit('${docSnap.id}', '${p.nom}', '${p.prix}', '${p.categorie}')">Modifier</button>
      </div>
    `;
  });
}

window.supprimerProduit = async function(id) {
  await deleteDoc(doc(db, "produits", id));
  alert("Produit supprimé !");
  chargerProduits();
};

window.modifierProduit = async function(id, nom, prix, categorie) {
  const nouveauNom = prompt("Nouveau nom :", nom);
  const nouveauPrix = prompt("Nouveau prix :", prix);
  const nouvelleCategorie = prompt("Nouvelle catégorie :", categorie);

  await updateDoc(doc(db, "produits", id), {
    nom: nouveauNom,
    prix: parseFloat(nouveauPrix),
    categorie: nouvelleCategorie.toLowerCase()
  });

  alert("Produit modifié !");
  chargerProduits();
};

chargerProduits();
