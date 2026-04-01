const products = [
  {
    id: 1,
    name: "Smartphone",
    price: 499,
    image: "assets/phone.jpg",
    rating: "★★★★☆ 4.4/5",
    shortDescription: "128GB storage, 5G support, premium performance.",
    description: "High-performance smartphone with 128GB storage, 5G connectivity, long battery backup, fast charging and premium display quality.",
    features: [
      "128GB internal storage",
      "5G network support",
      "High-resolution camera",
      "Long-lasting battery",
      "Fast and smooth performance"
    ]
  },
  {
    id: 2,
    name: "Sports Shoes",
    price: 59,
    image: "assets/shoes.jpg",
    rating: "★★★★☆ 4.2/5",
    shortDescription: "Comfortable, stylish and perfect for daily wear.",
    description: "Comfortable sports shoes designed for walking, running and daily use.",
    features: [
      "Comfortable sole",
      "Lightweight design",
      "Stylish look",
      "Durable material",
      "Good grip"
    ]
  },
  {
    id: 3,
    name: "Laptop",
    price: 899,
    image: "assets/laptop.jpg",
    rating: "★★★★☆ 4.6/5",
    shortDescription: "Fast, powerful and ideal for work and study.",
    description: "Powerful laptop suitable for study, office work and entertainment.",
    features: [
      "Fast processor",
      "Large display",
      "Long battery life",
      "Smooth multitasking",
      "Ideal for work and study"
    ]
  },
  {
    id: 4,
    name: "Novel",
    price: 15,
    image: "assets/novel.jpg",
    rating: "★★★★☆ 4.1/5",
    shortDescription: "A great read for book lovers and fiction fans.",
    description: "An interesting and enjoyable novel for fiction lovers.",
    features: [
      "Easy to read",
      "Attractive cover",
      "Good print quality",
      "Interesting story",
      "Perfect for book lovers"
    ]
  }
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let orders = JSON.parse(localStorage.getItem("orders")) || [];

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function saveOrders() {
  localStorage.setItem("orders", JSON.stringify(orders));
}

function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.querySelectorAll(".cart-count").forEach(el => {
    el.textContent = count;
  });
}

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  }

  saveCart();
  updateCartCount();
  alert(product.name + " added to cart");
}

function renderProductCards(containerId, list) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";

  list.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <div class="product-image-wrap">
        <img src="${product.image}" alt="${product.name}">
      </div>
      <h3>${product.name}</h3>
      <p class="product-price">$${product.price}</p>
      <p class="product-desc">${product.shortDescription}</p>
      <div class="product-buttons">
        <a href="product.html?id=${product.id}" class="view-btn">View Details</a>
        <button type="button" onclick="addToCart(${product.id})">Add to Cart</button>
      </div>
    `;

    container.appendChild(card);
  });
}

function renderFeaturedProducts() {
  renderProductCards("featured-products", products);
}

function setupProductSearch() {
  const input = document.getElementById("searchInput");
  const container = document.getElementById("all-products");
  if (!input || !container) return;

  renderProductCards("all-products", products);

  input.addEventListener("input", function () {
    const value = input.value.trim().toLowerCase();

    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(value) ||
      product.shortDescription.toLowerCase().includes(value)
    );

    renderProductCards("all-products", filtered);
  });
}

function renderProductDetail() {
  const container = document.getElementById("product-detail-container");
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get("id"));
  const product = products.find(p => p.id === id) || products[0];

  const featuresHtml = product.features.map(item => `<li>${item}</li>`).join("");

  container.innerHTML = `
    <div class="product-detail-layout">
      <div class="product-detail-image">
        <img src="${product.image}" alt="${product.name}">
      </div>
      <div class="product-detail-info">
        <h2>${product.name}</h2>
        <p class="rating">${product.rating}</p>
        <p class="product-price">$${product.price}</p>
        <p>${product.description}</p>
        <ul class="feature-list">${featuresHtml}</ul>
        <div class="delivery-box">
          <p><strong>Free Delivery</strong></p>
          <p>Expected delivery in 3-5 days</p>
        </div>
        <div class="product-buttons" style="margin-top:20px;">
          <button type="button" onclick="addToCart(${product.id})">Add to Cart</button>
          <a href="products.html" class="view-btn">Back to Products</a>
        </div>
      </div>
    </div>
  `;
}

function displayCartItems() {
  const body = document.getElementById("cart-items");
  const subtotalEl = document.getElementById("subtotal");
  const shippingEl = document.getElementById("shipping");
  const totalEl = document.getElementById("grand-total");

  if (!body) return;

  body.innerHTML = "";

  if (cart.length === 0) {
    body.innerHTML = `<tr><td colspan="6">Your cart is empty.</td></tr>`;
    if (subtotalEl) subtotalEl.textContent = "$0";
    if (shippingEl) shippingEl.textContent = "$0";
    if (totalEl) totalEl.textContent = "$0";
    return;
  }

  let subtotal = 0;

  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td><img src="${item.image}" alt="${item.name}" width="80"></td>
      <td>${item.name}</td>
      <td>$${item.price}</td>
      <td>
        <button type="button" onclick="changeQuantity(${item.id}, -1)">-</button>
        <span style="margin:0 8px;">${item.quantity}</span>
        <button type="button" onclick="changeQuantity(${item.id}, 1)">+</button>
      </td>
      <td>$${itemTotal}</td>
      <td><button type="button" onclick="removeFromCart(${item.id})">Remove</button></td>
    `;
    body.appendChild(row);
  });

  const shipping = 20;
  const grandTotal = subtotal + shipping;

  if (subtotalEl) subtotalEl.textContent = "$" + subtotal;
  if (shippingEl) shippingEl.textContent = "$" + shipping;
  if (totalEl) totalEl.textContent = "$" + grandTotal;
}

function changeQuantity(id, change) {
  const item = cart.find(product => product.id === id);
  if (!item) return;

  item.quantity += change;

  if (item.quantity <= 0) {
    cart = cart.filter(product => product.id !== id);
  }

  saveCart();
  updateCartCount();
  displayCartItems();
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
  updateCartCount();
  displayCartItems();
}

function setupCheckoutForm() {
  const form = document.getElementById("checkoutForm");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    const fullName = document.getElementById("fullName").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const address = document.getElementById("address").value.trim();
    const city = document.getElementById("city").value.trim();
    const postalCode = document.getElementById("postalCode").value.trim();

    if (!fullName || !phone || !address || !city || !postalCode) {
      alert("Please fill all checkout fields.");
      return;
    }

    localStorage.setItem("deliveryInfo", JSON.stringify({
      fullName,
      phone,
      address,
      city,
      postalCode
    }));

    window.location.href = "payment.html";
  });
}

function setupPaymentToggle() {
  const radios = document.querySelectorAll('input[name="pay"]');
  const cardDetails = document.getElementById("card-details");
  if (!radios.length || !cardDetails) return;

  function toggle() {
    const selected = document.querySelector('input[name="pay"]:checked');
    if (selected && selected.value === "Cash on Delivery") {
      cardDetails.style.display = "none";
    } else {
      cardDetails.style.display = "block";
    }
  }

  radios.forEach(radio => radio.addEventListener("change", toggle));
  toggle();
}

function setupPaymentForm() {
  const form = document.getElementById("paymentForm");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    const selected = document.querySelector('input[name="pay"]:checked');
    if (!selected) {
      alert("Please select a payment method.");
      return;
    }

    if (selected.value !== "Cash on Delivery") {
      const cardNumber = document.getElementById("cardNumber").value.trim();
      const expiry = document.getElementById("expiry").value.trim();
      const cvv = document.getElementById("cvv").value.trim();

      if (!/^\d{16}$/.test(cardNumber)) {
        alert("Card number must be 16 digits.");
        return;
      }

      if (!/^\d{2}\/\d{2}$/.test(expiry)) {
        alert("Expiry must be in MM/YY format.");
        return;
      }

      if (!/^\d{3}$/.test(cvv)) {
        alert("CVV must be 3 digits.");
        return;
      }
    }

    placeOrder();
  });
}

function placeOrder() {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 20;
  const total = subtotal + shipping;

  const order = {
    orderId: "MS" + Date.now(),
    date: new Date().toLocaleDateString(),
    items: [...cart],
    total: total,
    status: "Placed"
  };

  orders.push(order);
  saveOrders();
  localStorage.setItem("latestOrder", JSON.stringify(order));

  cart = [];
  saveCart();
  updateCartCount();

  window.location.href = "order.html";
}

function displayLatestOrder() {
  const orderIdEl = document.getElementById("order-id");
  const totalEl = document.getElementById("order-total");
  if (!orderIdEl || !totalEl) return;

  const latest = JSON.parse(localStorage.getItem("latestOrder"));
  if (!latest) return;

  orderIdEl.textContent = latest.orderId;
  totalEl.textContent = "$" + latest.total;
}

function displayOrderHistory() {
  const body = document.getElementById("orders-list");
  if (!body) return;

  orders = JSON.parse(localStorage.getItem("orders")) || [];
  body.innerHTML = "";

  if (orders.length === 0) {
    body.innerHTML = `<tr><td colspan="5">No orders found.</td></tr>`;
    return;
  }

  orders.forEach(order => {
    const itemsText = order.items.map(item => `${item.name} (${item.quantity})`).join(", ");

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${order.orderId}</td>
      <td>${order.date}</td>
      <td>${itemsText}</td>
      <td>$${order.total}</td>
      <td>${order.status || "Placed"}</td>
    `;
    body.appendChild(row);
  });
}

function setupContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("contactName").value.trim();
    const email = document.getElementById("contactEmail").value.trim();
    const message = document.getElementById("contactMessage").value.trim();

    if (!name || !email || !message) {
      alert("Please fill all fields.");
      return;
    }

    alert("Message sent successfully!");
    form.reset();
  });
}

document.addEventListener("DOMContentLoaded", function () {
  updateCartCount();
  renderFeaturedProducts();
  setupProductSearch();
  renderProductDetail();
  displayCartItems();
  setupCheckoutForm();
  setupPaymentToggle();
  setupPaymentForm();
  displayLatestOrder();
  displayOrderHistory();
  setupContactForm();
});
