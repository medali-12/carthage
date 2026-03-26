import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { 
  getStorage, ref, uploadBytes, getDownloadURL 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

// 🔥 Importation de TON db existant
import { db } from "./firebase-config.js";

// 🔥 MAIS tu dois réinitialiser Firebase pour Storage
const firebaseConfig = {
  apiKey: "AIzaSyCzmBq6kM8ufzwzxSO6P-fB8AXxXfBaCQ8",
  authDomain: "carthage-cafe.firebaseapp.com",
  projectId: "carthage-cafe",
  storageBucket: "carthage-cafe.firebasestorage.app",
  messagingSenderId: "701972195657",
  appId: "1:701972195657:web:7baec9607886e0b97ed298",
  measurementId: "G-L2X433VK0M"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

// Sélecteurs HTML
const produitsDiv = document.getElementById("produits");
const btnAjouter = document.getElementById("ajouter");
const inputImage = document.getElementById("image");

// 🔥 Upload image vers Firebase Storage
async function uploadImage(file) {
  const imageRef = ref(storage, "produits/" + Date.now() + "-" + file.name);
  await uploadBytes(imageRef, file);
  return await getDownloadURL(imageRef);
}

// 🔥 Ajouter un produit
btnAjouter.addEventListener("click", ajouterProduit);

async function ajouterProduit() {
  const nom = document.getElementById("nom").value;
  const prix = document.getElementById("prix").value;
  const categorie = document.getElementById("categorie").value.toLowerCase();
  const file = inputImage.files[0];

  if (!nom || !prix || !categorie) {
    alert("Veuillez remplir tous les champs.");
    return;
  }

  let imageURL = "";
  if (file) {
    imageURL = await uploadImage(file);
  }

  await addDoc(collection(db, "produits"), {
    nom,
    prix: parseFloat(prix),
    categorie,
    imageURL: imageURL
  });

  alert("Produit ajouté !");
  chargerProduits();
}

// 🔥 Charger les produits existants
async function chargerProduits() {
  produitsDiv.innerHTML = "";

  const snapshot = await getDocs(collection(db, "produits"));

  snapshot.forEach(docSnap => {
    const p = docSnap.data();

    produitsDiv.innerHTML += `
      <div class="produit-box">
        <img src="${p.imageURL || 'images/default.jpg'}" class="admin-img">

        <h3>${p.nom}</h3>
        <p>Prix : ${p.prix} DT</p>
        <p>Catégorie : ${p.categorie}</p>

        <button onclick="supprimerProduit('${docSnap.id}')">Supprimer</button>
        <button onclick="modifierProduit('${docSnap.id}', '${p.nom}', '${p.prix}', '${p.categorie}')">Modifier</button>
      </div>
    `;
  });
}

// 🔥 Supprimer un produit
window.supprimerProduit = async function(id) {
  await deleteDoc(doc(db, "produits", id));
  alert("Produit supprimé !");
  chargerProduits();
};

// 🔥 Modifier un produit
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

// Charger au démarrage
chargerProduits();
