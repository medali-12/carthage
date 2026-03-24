// Clés de stockage
const CART_KEY = 'carthage_panier';
const ORDERS_KEY = 'carthage_commandes';

// ---------------- PANIER ----------------

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCart(item) {
  const cart = getCart();
  const existing = cart.find(p => p.name === item.name);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...item, qty: 1 });
  }

  saveCart(cart);
  alert('Ajouté au panier : ' + item.name);
  renderCartSummary();
}

function removeFromCart(name) {
  let cart = getCart();
  cart = cart.filter(p => p.name !== name);
  saveCart(cart);
  renderCartSummary();
}

function changeQty(name, delta) {
  const cart = getCart();
  const item = cart.find(p => p.name === name);
  if (!item) return;

  item.qty += delta;

  if (item.qty <= 0) {
    saveCart(cart.filter(p => p.name !== name));
  } else {
    saveCart(cart);
  }

  renderCartSummary();
}

function getCartTotal() {
  const cart = getCart();
  return cart.reduce((sum, p) => sum + p.price * p.qty, 0);
}

// ---------------- AFFICHAGE PANIER ----------------

function renderCartSummary() {
  const container = document.querySelector('.cart-items');
  const totalEl = document.querySelector('.cart-total-value');

  if (!container || !totalEl) return;

  const cart = getCart();
  container.innerHTML = '';

  if (cart.length === 0) {
    container.innerHTML = '<p>Votre panier est vide.</p>';
    totalEl.textContent = '0.000 DT';
    return;
  }

  cart.forEach(item => {
    const row = document.createElement('div');
    row.className = 'cart-item-row';
    row.innerHTML = `
      <span class="cart-item-name">${item.name}</span>
      <span class="cart-item-qty">x${item.qty}</span>
      <span>${(item.price * item.qty).toFixed(3)} DT</span>
    `;
    container.appendChild(row);
  });

  totalEl.textContent = getCartTotal().toFixed(3) + ' DT';
}

// ---------------- COMMANDES ----------------

function getOrders() {
  try {
    return JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
  } catch {
    return [];
  }
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

  if (!clientName.trim()) {
    alert('Veuillez entrer votre nom.');
    return false;
  }

  const orders = getOrders();

  const order = {
    id: Date.now(),
    date: new Date().toLocaleString(),
    client: clientName.trim(),
    note: note.trim(),
    items: cart,
    total: getCartTotal()
  };

  orders.push(order);
  saveOrders(orders);

  saveCart([]); // vider panier
  return true;
}

// ---------------- ADMIN ----------------

function renderOrdersTable() {
  const tbody = document.querySelector('#orders-body');
  if (!tbody) return;

  const orders = getOrders();
  tbody.innerHTML = '';

  if (!orders.length) {
    tbody.innerHTML = '<tr><td colspan="5">Aucune commande pour le moment.</td></tr>';
    return;
  }

  orders
    .sort((a, b) => b.id - a.id)
    .forEach(order => {
      const tr = document.createElement('tr');

      const itemsText = order.items
        .map(i => `${i.name} x${i.qty} (${(i.price * i.qty).toFixed(3)} DT)`)
        .join('<br>');

      tr.innerHTML = `
        <td>${order.id}</td>
        <td>${order.date}</td>
        <td><strong>${order.client}</strong><br>${order.note || ''}</td>
        <td>${itemsText}</td>
        <td>
          <strong>${order.total.toFixed(3)} DT</strong><br>
          <button class="btn btn-outline" data-action="delete" data-id="${order.id}" style="margin-top:4px">
            Supprimer
          </button>
        </td>
      `;

      tbody.appendChild(tr);
    });

  tbody.addEventListener('click', e => {
    const btn = e.target.closest('button[data-action="delete"]');
    if (!btn) return;

    const id = Number(btn.getAttribute('data-id'));
    const orders = getOrders().filter(o => o.id !== id);

    saveOrders(orders);
    renderOrdersTable();
  }, { once: true });
}

// ---------------- PROTECTION ADMIN ----------------

function protectAdmin() {
  const pwd = prompt('Mot de passe admin :');

  if (pwd !== 'robbana@9193') {
    alert('Mot de passe incorrect.');
    window.location.href = 'index.html';
  }
}

// ---------------- INITIALISATION ----------------

document.addEventListener('DOMContentLoaded', () => {

  // Panier
  if (document.querySelector('.cart-summary')) {
    renderCartSummary();
  }

  // Formulaire commande
  const orderForm = document.querySelector('#order-form');
  if (orderForm) {
    orderForm.addEventListener('submit', e => {
      e.preventDefault();

      const name = document.querySelector('#client-name').value || '';
      const note = document.querySelector('#client-note').value || '';

      const ok = placeOrder(name, note);

      if (ok) {
        alert('Commande envoyée. Merci !');
        document.querySelector('#client-name').value = '';
        document.querySelector('#client-note').value = '';
        renderCartSummary();
      }
    });
  }

  // Page admin
  if (document.body.classList.contains('admin-page')) {
    protectAdmin();
    renderOrdersTable();
  }
});
