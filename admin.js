import { db } from "./firebase.js";
import { doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

document.getElementById("save").addEventListener("click", async () => {
  const id = document.getElementById("id").value;
  const price = Number(document.getElementById("price").value);

  if (!id || price <= 0) {
    alert("Veuillez entrer un ID et un prix valide.");
    return;
  }

  try {
    await updateDoc(doc(db, "boissons", id), { price });
    alert("Prix mis à jour !");
  } catch (error) {
    alert("Erreur : vérifiez que l'ID existe dans Firestore.");
  }
});
