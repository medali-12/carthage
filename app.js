// ---------------- FIREBASE (menu) ----------------

import { db } from "./firebase.js";
import { 
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Charger le menu depuis Firestore
async function loadMenu() {
  const menuDiv = document.getElementById("menu");
  if (!menuDiv) return;

  menuDiv.innerHTML = "";

  const querySnapshot = await getDocs(collection(db, "produits"));

  querySnapshot.forEach((docSnap) => {
    const item = docSnap.data();

    if (!item.available) return; // cacher les produits indisponibles

    menuDiv.innerHTML += `
      <div class="menu-item">
        <h3>${item.name}</h3>
        <p>${item.price} DT</p>
        <button onclick='addToCart(${JSON.stringify(item)})'>Ajouter</button>
      </div>
    `;
  });
}

// ---------------- PANIER ----------------

const CART_KEY = 'carthage_panier';
const ORDERS_KEY = 'carthage_commandes';

function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCart(item) {
  const cart = getCart();
  const existing = cart.find(p => p.name === item.name);

  if (existing) existing.qty += 1;
  else cart.push({ ...item, qty: 1 });

  saveCart(cart);
  alert('Ajouté au panier : ' + item.name);
  renderCartSummary();
}

function getCartTotal() {
  return getCart().reduce((sum, p) => sum + p.price * p.qty, 0);
}

function renderCartSummary() {
  const container = document.querySelector('.cart-items');
  const totalEl = document.querySelector('.cart-total-value');

  if (!container || !totalEl) return;

  const cart = getCart();
  container.innerHTML = '';

  if (!cart.length) {
    container.innerHTML = '<p>Votre panier est vide.</p>';
    totalEl.textContent = '0.000 DT';
    return;
  }

  cart.forEach(item => {
    container.innerHTML += `
      <div class="cart-item-row">
        <span>${item.name}</span>
        <span>x${item.qty}</span>
        <span>${(item.price * item.qty).toFixed(3)} DT</span>
      </div>
    `;
  });

  totalEl.textContent = getCartTotal().toFixed(3) + ' DT';
}

// ---------------- COMMANDES ----------------

function getOrders() {
  return JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
}

function saveOrders(orders) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

function placeOrder(clientName, note) {
  const cart = getCart();

  if (!cart.length) {
    alert('Votre panier est vide.');
    return false;
  }

  const order = {
    id: Date.now(),
    date: new Date().toLocaleString(),
    client: clientName,
    note,
    items: cart,
    total: getCartTotal()
  };

  const orders = getOrders();
  orders.push(order);
  saveOrders(orders);

  saveCart([]);
  return true;
}

// ---------------- INITIALISATION ----------------

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById("menu")) loadMenu();
  if (document.querySelector('.cart-summary')) renderCartSummary();
});
