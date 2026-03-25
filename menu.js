import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs }
  from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "TA_CLE_API",
  authDomain: "TON_PROJET.firebaseapp.com",
  projectId: "TON_PROJET",
  storageBucket: "TON_PROJET.appspot.com",
  messagingSenderId: "xxxx",
  appId: "xxxx"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function chargerMenu() {
  const querySnapshot = await getDocs(collection(db, "produits"));
  const menuDiv = document.getElementById("menu");

  querySnapshot.forEach((doc) => {
    const p = doc.data();

    const imagePath = p.image || `images/${p.categorie}.jpg`;

    menuDiv.innerHTML += `
      <div class="carte">
        <img src="${imagePath}" alt="${p.nom}">
        <h3>${p.nom}</h3>
        <p>${p.prix} CHF</p>
      </div>
    `;
  });
}

chargerMenu();
