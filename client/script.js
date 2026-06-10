const API_URL = "http://localhost:3000";

// DOM Elements
const productContainer = document.getElementById("product-container");
const cartItemsContainer = document.getElementById("cart-items-container");
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total");

// Local state for product quantities before adding to cart
// Format: { productId: quantity }
const localQuantities = {};

// -------------------------------------------------------------------
// 1. Fetch & Render Products
// -------------------------------------------------------------------
const fetchProducts = async () => {
  try {
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) throw new Error("Failed to fetch products");
    const products = await response.json();

    // Initialize local quantities to 1
    products.forEach((p) => {
      if (!localQuantities[p.id]) localQuantities[p.id] = 1;
    });

    renderProducts(products);
  } catch (error) {
    console.error(error);
    productContainer.innerHTML = `<div class="loader" style="color:red;">Error loading products</div>`;
  }
};

const renderProducts = (products) => {
  productContainer.innerHTML = "";

  if (products.length === 0) {
    productContainer.innerHTML = `<p>No products available.</p>`;
    return;
  }

  products.forEach((product) => {
    const card = document.createElement("div");
    card.className = "card";

    // Get current local quantity for this product
    const currentQty = localQuantities[product.id] || 1;

    card.innerHTML = `
        <div class="card-image" style="cursor: pointer;" onclick="navigateToDetails('${product.id}')">
            <img src="${product.image}" alt="${product.title}" onerror="this.src='https://placehold.co/400x400?text=No+Image'">
        </div>
        <div class="card-content">
            <h3 class="card-title" title="${product.title}" style="cursor: pointer;" onclick="navigateToDetails('${product.id}')">${product.title}</h3>
            <span class="card-price">$${Number(product.price).toFixed(2)}</span>
            
            <div class="quantity-controls">
                <button class="qty-btn" onclick="updateLocalQty('${product.id}', -1)">-</button>
                <span class="qty-display" id="qty-${product.id}">${currentQty}</span>
                <button class="qty-btn" onclick="updateLocalQty('${product.id}', 1)">+</button>
            </div>
            
            <button class="btn btn-primary" onclick="addToCart('${product.id}')">Add to Cart</button>
        </div>
    `;
    productContainer.appendChild(card);
  });
};

// Update the local quantity before adding to cart
const updateLocalQty = (productId, change) => {
  if (!localQuantities[productId]) localQuantities[productId] = 1;

  let newQty = localQuantities[productId] + change;
  if (newQty < 1) newQty = 1; // Minimum quantity is 1

  localQuantities[productId] = newQty;

  // Update the DOM for this specific product
  const qtyDisplay = document.getElementById(`qty-${productId}`);
  if (qtyDisplay) qtyDisplay.textContent = newQty;
};

// -------------------------------------------------------------------
// 2. Cart Logic (PLACEHOLDERS for lesson)
// -------------------------------------------------------------------

const fetchCart = async () => {
  try {
    // ~~~ FETCH CART PLACEHOLDER ~~~
    const response = await fetch(`${API_URL}/cart`);
    if (!response.ok) {
      renderCart([]);
      return;
    }
    const cartItems = await response.json();
    // console.log(cartItems);
    renderCart(cartItems);
  } catch (error) {
    console.error("Cart fetch error:", error);
    renderCart([]);
  }
}; //

const renderCart = (cartItems) => {
  // ~~~ RENDER CART PLACEHOLDER ~~~
  // Calculate total price and total items
  let totalItems = 0;
  let totalPrice = 0;

  cartItemsContainer.innerHTML = "";

  if (cartItems.length === 0) {
    cartItemsContainer.innerHTML = `<p class="empty-cart-msg">Your cart is empty.</p>`;
  } else {
    cartItems.forEach((item) => {
      totalItems += item.quantity;
      totalPrice += item.price * item.quantity;

      const itemEl = document.createElement("div");
      itemEl.className = "cart-item";
      itemEl.innerHTML = `
                <div class="cart-item-info">
                    <p class="cart-item-title" title="${item.title}">${item.title}</p>
                    <span class="cart-item-price">$${Number(item.price).toFixed(2)} x ${item.quantity}</span>
                </div>
                <div class="cart-item-actions">
                    <button class="qty-btn" onclick="updateCartItemQuantity('${item.id}', ${item.quantity - 1})">-</button>
                    <span class="qty-display">${item.quantity}</span>
                    <button class="qty-btn" onclick="updateCartItemQuantity('${item.id}', ${item.quantity + 1})">+</button>
                    <button class="btn btn-danger" style="padding: 4px 8px; font-size: 12px; width: auto;" onclick="removeFromCart('${item.id}')">X</button>
                </div>
            `;
      cartItemsContainer.appendChild(itemEl);
    });
  }

  // Update summaries
  cartCount.textContent = `${totalItems} items`;
  cartTotal.textContent = `$${totalPrice.toFixed(2)}`;
};

const addToCart = async (productId) => {
  const quantityToAdd = localQuantities[productId] || 1;
  // ~~~ ADD TO CART PLACEHOLDER ~~~
  //* console.log(`Adding product ${productId} to cart with quantity ${quantityToAdd}`);
  //fetch single product from jsonserver
  const prodres = await fetch(`${API_URL}/products/${productId}`);
  const response = await fetch(`${API_URL}/cart`);

  try {
    if (!response.ok) {
      throw new Error("Failed to fetch cart items");
    }
    if (!prodres.ok) {
      throw new Error("Failed To fetch this product");
    }

    const product = await prodres.json();
    const cartitems = await response.json();

    if (cartitems.length == 0) {
      await fetch(`${API_URL}/cart`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ ...product, quantity: quantityToAdd }),
      });
    } else {
      console.log(cartitems);
      console.log(product);
      //update cart item qty
      const cartItemExists = cartitems.find((el) => el.title == product.title);
      console.log(cartItemExists);
      if (cartItemExists) {
        updateCartItemQuantity(
          cartItemExists.id,
          cartItemExists.quantity + quantityToAdd,
        );
      } else {
        await fetch(`${API_URL}/cart`, {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({ ...product, quantity: quantityToAdd }),
        });
      }
    }
  } catch (error) {
    console.error("Error fetching product details:", error.message);
  } finally {
    fetchCart();
  }

  localQuantities[productId] = 1;
  const qtyDisplay = document.getElementById(`qty-${productId}`);
  if (qtyDisplay) qtyDisplay.textContent = 1;
};

const updateCartItemQuantity = async (cartItemId, newQuantity) => {
  // ~~~ UPDATE CART ITEM PLACEHOLDER ~~~
  try {
    const response = await fetch(`${API_URL}/cart/${cartItemId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ quantity: newQuantity }),
    });
    if (newQuantity < 1) {
      await removeFromCart(cartItemId);
      return;
    }
    await fetchCart();
  } catch (error) {
    console.error("Error updating cart item quantity:", error.message);
  }
};

const removeFromCart = async (cartItemId) => {
  // ~~~ REMOVE FROM CART PLACEHOLDER ~~~
  try {
    const response = await fetch(`${API_URL}/cart/${cartItemId}`, {
      method: "DELETE",
    });
    await fetchCart();
    if (!response.ok) {
      throw new Error("Failed to remove item from cart");
    }
  } catch (error) {
    console.log(error.message);
  }
};


// functions ive made handmade: removeFromCart, updateCartItemQuantity, addToCart,fetchCart.

// Initial Fetch
fetchProducts();
fetchCart();
// -------------------------------------------------------------------
// CHECKOUT FUNCTIONALITY
// -------------------------------------------------------------------

const openCheckoutForm = async () => {
  const response = await fetch(`${API_URL}/cart`);
  const cartItems = await response.json();
  
  if (cartItems.length === 0) {
    alert("Your cart is empty! Add items before checkout.");
    return;
  }
  
  document.getElementById("checkout-modal").style.display = "flex";
};

const closeCheckoutForm = () => {
  document.getElementById("checkout-modal").style.display = "none";
  document.getElementById("checkout-error").style.display = "none";
  document.getElementById("checkout-success").style.display = "none";
  document.getElementById("checkout-form").reset();
};

document.getElementById("checkout-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const errorEl = document.getElementById("checkout-error");
  const successEl = document.getElementById("checkout-success");
  errorEl.style.display = "none";
  successEl.style.display = "none";
  
  const name = document.getElementById("customer-name").value.trim();
  const email = document.getElementById("customer-email").value.trim();
  const phone = document.getElementById("customer-phone").value.trim();
  const address = document.getElementById("customer-address").value.trim();
  
  if (!name || !email || !phone || !address) {
    errorEl.textContent = "Please fill all fields";
    errorEl.style.display = "block";
    return;
  }
  
  try {
    // Calculate total
    const cartRes = await fetch(`${API_URL}/cart`);
    const cartItems = await cartRes.json();
    
    if (cartItems.length === 0) {
      errorEl.textContent = "Your cart is empty";
      errorEl.style.display = "block";
      return;
    }
    
    // Calculate total
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Create order object
    const order = {
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      customerAddress: address,
      items: cartItems,
      total: parseFloat(total.toFixed(2)),
      status: "pending",
      createdAt: new Date().toISOString(),
      notes: ""
    };
    
    // Send order to admin (POST to orders endpoint)
    const response = await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order)
    });
    
    if (!response.ok) {
      throw new Error("Failed to place order");
    }
    
    // Clear cart after successful order
    for (const item of cartItems) {
      await fetch(`${API_URL}/cart/${item.id}`, { method: "DELETE" });
    }
    
    successEl.textContent = "Order placed successfully! Admin will review and update the status soon.";
    successEl.style.display = "block";
    
    setTimeout(() => {
      closeCheckoutForm();
      fetchCart();
    }, 2000);
    
  } catch (error) {
    console.error(error);
    errorEl.textContent = error.message || "Error placing order";
    errorEl.style.display = "block";
  }
});

// -------------------------------------------------------------------
// VIEW MY ORDERS
// -------------------------------------------------------------------

const viewMyOrders = async () => {
  document.getElementById("orders-modal").style.display = "flex";
  
  try {
    const response = await fetch(`${API_URL}/orders`);
    const orders = await response.json();
    
    const ordersList = document.getElementById("orders-list");
    
    if (!orders || orders.length === 0) {
      ordersList.innerHTML = "<p>No orders yet.</p>";
      return;
    }
    
    ordersList.innerHTML = "";
    orders.forEach((order, index) => {
      const statusClass = `status-${order.status.toLowerCase()}`;
      const itemsHtml = order.items.map(item => 
        `<p>${item.title} x${item.quantity} = $${(item.price * item.quantity).toFixed(2)}</p>`
      ).join("");

      // Display client replies
      const repliesHtml = (order.replies && order.replies.length > 0) ? 
        order.replies.map(reply => `
          <div style="background-color: #e7f3ff; padding: 10px; margin: 8px 0; border-left: 4px solid #0066cc; border-radius: 4px;">
            <p style="margin: 0 0 5px 0; font-weight: 600; font-size: 12px; color: #0066cc;">Your Reply</p>
            <p style="margin: 0; font-size: 12px; white-space: pre-wrap;">${reply.text || ''}</p>
            ${reply.image ? `<img src="${reply.image}" style="max-width: 200px; margin-top: 8px; border-radius: 4px;">` : ''}
            <p style="margin: 5px 0 0 0; font-size: 11px; color: #666;">${new Date(reply.timestamp).toLocaleString()}</p>
          </div>
        `).join('') : '';
      
      const orderEl = document.createElement("div");
      orderEl.className = "order-item";
      orderEl.innerHTML = `
        <div class="order-header">
          <span class="order-id">Order #${index + 1}</span>
          <span class="order-status ${statusClass}">${order.status}</span>
        </div>
        <div class="order-details">
          <p><strong>Customer:</strong> ${order.customerName}</p>
          <p><strong>Email:</strong> ${order.customerEmail}</p>
          <p><strong>Phone:</strong> ${order.customerPhone}</p>
          <p><strong>Address:</strong> ${order.customerAddress}</p>
          <p><strong>Ordered:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
        </div>
        <div class="order-items">
          <strong>Items:</strong>
          ${itemsHtml}
        </div>
        <div class="order-total">Total: $${order.total.toFixed(2)}</div>
        
        ${order.notes ? `
          <div style="background-color: #fff3cd; padding: 10px; margin: 10px 0; border-left: 4px solid #ff9800; border-radius: 4px;">
            <p style="margin: 0 0 5px 0; font-weight: 600; font-size: 12px; color: #856404;">📝 Admin Notes:</p>
            <p style="margin: 0; font-size: 12px; white-space: pre-wrap;">${order.notes}</p>
          </div>
        ` : ''}
        
        ${repliesHtml ? `
          <div style="margin-top: 10px;">
            <p style="margin: 0 0 8px 0; font-weight: 600; font-size: 12px;">Your Replies:</p>
            ${repliesHtml}
          </div>
        ` : ''}
        
        <div style="margin-top: 12px; padding: 12px; background-color: #f0f0f0; border-radius: 4px;">
          <p style="margin: 0 0 8px 0; font-weight: 600; font-size: 12px;">Reply to Admin:</p>
          <textarea id="reply-text-${order.id}" style="
            width: 100%;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 12px;
            font-family: inherit;
            min-height: 50px;
            resize: vertical;
            margin-bottom: 8px;
          " placeholder="Type your message..."></textarea>
          
          <div style="margin-bottom: 8px;">
            <label style="display: flex; align-items: center; cursor: pointer; font-size: 12px; padding: 6px 10px; background-color: #e0e0e0; border-radius: 4px; width: fit-content;">
              📷 Upload Image
              <input type="file" id="reply-image-${order.id}" accept="image/*" style="display: none;">
            </label>
            <div id="image-preview-${order.id}" style="margin-top: 8px; font-size: 12px;"></div>
          </div>
          
          <button onclick="sendOrderReply('${order.id}')" class="btn btn-primary" style="width: 100%; padding: 8px; font-size: 12px;">
            ✉️ Send Reply
          </button>
          <div id="reply-feedback-${order.id}" style="margin-top: 8px; font-size: 12px; display: none;"></div>
        </div>
      `;
      ordersList.appendChild(orderEl);

      // Handle image preview
      const imageInput = document.getElementById(`reply-image-${order.id}`);
      if (imageInput) {
        imageInput.addEventListener("change", (e) => {
          const file = e.target.files[0];
          const previewEl = document.getElementById(`image-preview-${order.id}`);
          if (file) {
            previewEl.textContent = `✓ ${file.name} selected`;
            previewEl.style.color = "#28a745";
          }
        });
      }
    });
    
  } catch (error) {
    console.error(error);
    document.getElementById("orders-list").innerHTML = "<p style='color: red;'>Error loading orders</p>";
  }
};

// Send reply from client
const sendOrderReply = async (orderId) => {
  try {
    const textEl = document.getElementById(`reply-text-${orderId}`);
    const imageInputEl = document.getElementById(`reply-image-${orderId}`);
    const feedbackEl = document.getElementById(`reply-feedback-${orderId}`);
    
    const text = textEl.value.trim();
    const imageFile = imageInputEl.files[0];

    if (!text && !imageFile) {
      feedbackEl.textContent = "⚠️ Please add text or image";
      feedbackEl.style.color = "#ff9800";
      feedbackEl.style.display = "block";
      return;
    }

    let imageBase64 = null;
    if (imageFile) {
      imageBase64 = await fileToBase64(imageFile);
    }

    // Get current order
    const ordersRes = await fetch(`${API_URL}/orders`);
    const orders = await ordersRes.json();
    const order = orders.find(o => o.id === orderId);

    if (!order) {
      throw new Error("Order not found");
    }

    // Add reply to order
    const replies = order.replies || [];
    replies.push({
      text: text,
      image: imageBase64,
      timestamp: new Date().toISOString()
    });

    // Update order with new reply
    const response = await fetch(`${API_URL}/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ replies: replies })
    });

    if (!response.ok) {
      throw new Error("Failed to send reply");
    }

    feedbackEl.textContent = "✓ Reply sent successfully!";
    feedbackEl.style.color = "#28a745";
    feedbackEl.style.display = "block";

    // Clear form
    textEl.value = "";
    imageInputEl.value = "";
    document.getElementById(`image-preview-${orderId}`).textContent = "";

    // Refresh orders after 1 second
    setTimeout(() => {
      viewMyOrders();
    }, 1000);

  } catch (error) {
    console.error(error);
    const feedbackEl = document.getElementById(`reply-feedback-${orderId}`);
    feedbackEl.textContent = "✗ Failed to send reply";
    feedbackEl.style.color = "#dc3545";
    feedbackEl.style.display = "block";
  }
};

// Convert file to Base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

// -------------------------------------------------------------------
// BOM Navigation, Preview, and Pop-up management
// -------------------------------------------------------------------

const navigateToDetails = (productId) => {
  window.location.href = `details.html?id=${productId}`;
};
window.navigateToDetails = navigateToDetails;

// Dynamic "Close Window" button inside pop-up store window
if (window.opener) {
  const closeBtn = document.createElement("button");
  closeBtn.id = "popup-close-btn";
  closeBtn.className = "btn btn-danger";
  closeBtn.innerHTML = "❌ Close Preview";
  closeBtn.style.position = "fixed";
  closeBtn.style.bottom = "20px";
  closeBtn.style.right = "20px";
  closeBtn.style.width = "auto";
  closeBtn.style.zIndex = "9999";
  closeBtn.style.boxShadow = "0 4px 12px rgba(0,0,0,0.25)";
  closeBtn.style.padding = "12px 24px";
  closeBtn.style.borderRadius = "30px";
  closeBtn.style.fontSize = "14px";
  closeBtn.style.fontWeight = "bold";
  closeBtn.style.border = "none";
  closeBtn.style.cursor = "pointer";
  
  closeBtn.onclick = () => {
    window.close();
  };
  
  document.body.appendChild(closeBtn);
}
