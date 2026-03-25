// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc }
  from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL }
  from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

// CONFIG FIREBASE (mets ta config ici)
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
const storage = getStorage(app);

// Fonction upload image
async function uploadImage(file) {
  const imageRef = ref(storage, "produits/" + Date.now() + "-" + file.name);
  await uploadBytes(imageRef, file);
  return await getDownloadURL(imageRef);
}

// Ajouter un produit
document.getElementById("addProductBtn").addEventListener("click", async () => {

  const nom = document.getElementById("nom").value;
  const prix = parseFloat(document.getElementById("prix").value);
  const categorie = document.getElementById("categorie").value;
  const file = document.getElementById("imageInput").files[0];

  let imageURL = "";

  if (file) {
    imageURL = await uploadImage(file);
  }

  await addDoc(collection(db, "produits"), {
    nom,
    prix,
    categorie,
    image: imageURL
  });

  alert("Produit ajouté !");
});
