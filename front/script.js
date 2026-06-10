// API Configuration
const API_URL = "http://localhost:3000";

// Validate image URL and return specific error message
const validateImageUrl = (url) => {
  // Check if URL starts with http:// or https://
  const protocolPattern = /^https?:\/\//;
  if (!protocolPattern.test(url)) {
    return "URL must start with http:// or https://";
  }

  // Check if URL has a valid domain extension (.com, .org, .net, etc.)
  // const extensionPattern = /\.(com|org|net|io|co|edu|gov|info|us|uk|de|fr|jp|cn|au|ca|ru|br)(?:\/|$)/i;
  // if (!extensionPattern.test(url)) {
  //   return "URL must contain a valid domain extension (.com, .org, .net, .io, etc.)";
  // }

  // If all validations pass, return null (no error)
  return null;
};
// DOM Elements
const productContainer = document.getElementById("product-container");
const productCount = document.getElementById("product-count");
const addProductForm = document.getElementById("add-product-form");
const categorySelect = document.getElementById("category");
const errorFormElement = document.getElementById("error");
const titleInput = document.getElementById("title");
const priceInput = document.getElementById("price");
const imageInput = document.getElementById("image");
const descriptionInput = document.getElementById("description");
const scrollToTopBtn = document.getElementById("scrollToTop");
// -------------------------------------------------------------------
// 1. GET Request: Fetch products and render them (Implemented)
// -------------------------------------------------------------------
const fetchProducts = async () => {
  try {
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status}`);
    }

    const products = await response.json();
    renderProducts(products);
  } catch (error) {
    console.error("Error fetching data:", error);
    productContainer.innerHTML = `
            <div style="color: red; padding: 20px; text-align: center; grid-column: 1/-1;">
                Error loading products. Ensure json-server is running on ${API_URL}
            </div>
        `;
  }
};

const fetchCategories = async () => {
  try {
    const response = await fetch(`${API_URL}/categories`);
    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.status}`);
    }
    const categories = await response.json();
    renderCategories(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
};
// -------------------------------------------------------------------
// 1. GET Request: Fetch single product and render them (Implemented)
// -------------------------------------------------------------------
const fetchSingleProduct = async (id, editMode = false) => {
  try {
    const response = await fetch(`${API_URL}/products/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${response.status}`);
    }
    const product = await response.json();
    if (editMode) return product;
    else renderProducts([product]);
  } catch (error) {
    console.log(error);
  }
};
// render categories to the ui
const renderCategories = (categories) => {
  categorySelect.innerHTML = ""; // Clear existing options
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.name;
    option.textContent = category.name;
    categorySelect.appendChild(option);
  });
};

// Render products to the UI
const renderProducts = (products) => {
  // Update count
  productCount.textContent = `${products.length} product${products.length !== 1 ? "s" : ""}`;

  // Clear container
  productContainer.innerHTML = "";

  if (products.length === 0) {
    productContainer.innerHTML = `<div class="loader">No products found. Add one!</div>`;
    return;
  }

  // Create and append cards
  products.forEach((product) => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
            <div class="card-image" style="cursor: pointer;" onclick="navigateToDetails('${product.id}')">
                <img src="${product.image}" alt="${product.title}" onerror="this.src='https://placehold.co/400x400?text=No+Image'">
            </div>
            <div class="card-content">
                <span class="card-category">${product.category}</span>
                <h3 class="card-title" title="${product.title}" style="cursor: pointer;" onclick="navigateToDetails('${product.id}')">${product.title}</h3>
                <p class="card-description" title="${product.description}">${product.description}</p>
                
                <div class="card-footer">
                    <span class="card-price">$${Number(product.price).toFixed(2)}</span>
                    <div class="card-actions">
                        <button class="btn btn-warning" onclick="editProduct('${product.id}')">Edit</button>
                        <button class="btn btn-danger" onclick="deleteProduct('${product.id}')">Delete</button>
                    </div>
                </div>
            </div>
        `;

    productContainer.appendChild(card);
  });
};

// -------------------------------------------------------------------
// 2. POST Request: Add a new product (PLACEHOLDER for lesson)
// -------------------------------------------------------------------
addProductForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = titleInput.value;
  const price = priceInput.value;
  const category = categorySelect.value;
  const image = imageInput.value;
  const description = descriptionInput.value;

  if (!title || !price || !category || !image || !description) {
    errorFormElement.textContent = "Please fill all the fields";
    errorFormElement.style.display = "block";
    return;
  }

  const imageUrlError = validateImageUrl(image);
  if (imageUrlError) {
    errorFormElement.textContent = imageUrlError;
    errorFormElement.style.display = "block";
    return;
  }

  errorFormElement.style.display = "none"; // Clear previous errors

  const newProduct = { title, price, category, image, description };

  await addProduct(newProduct);
});

const addProduct = async (product) => {
  try {
    const response = await fetch(`${API_URL}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });

    if (!response.ok) throw new Error("Can't add this product");

    // Clear form
    titleInput.value = "";
    priceInput.value = "";
    imageInput.value = "";
    descriptionInput.value = "";

    // Only refresh AFTER the POST succeeds
    fetchProducts();
  } catch (error) {
    console.error(error);
    errorFormElement.textContent = error.message;
    errorFormElement.style.display = "block";
  }
};

// -------------------------------------------------------------------
// 3. DELETE Request: Remove a product (PLACEHOLDER for lesson)
// -------------------------------------------------------------------
const deleteProduct = (id) => {
  // ~~~ DELETE LOGIC PLACEHOLDER ~~~
  const deleteProductReq = async (id) => {
    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Can't delete this product");
      }
      const data = await response.json();
      console.log(data);
      fetchProducts();
    } catch (error) {
      console.error(error);
    }
  };

  deleteProductReq(id);

  // Hint for the lesson:
  // 1. fetch(\`\${API_URL}/\${id}\`, { method: 'DELETE' })
  // 2. Handle response
  // 3. fetchProducts() again to refresh list
};

// -------------------------------------------------------------------
// 4. PUT Request: Edit a product (PLACEHOLDER for lesson)
// -------------------------------------------------------------------
const editProduct = (id) => {
  // ~~~ EDIT LOGIC PLACEHOLDER ~~~
  titleInput.value = "";
  priceInput.value = "";
  imageInput.value = "";
  descriptionInput.value = "";
  const getProductData = async (id) => {
    const product = await fetchSingleProduct(id, true);
    titleInput.value = product.title;
    priceInput.value = product.price;
    categorySelect.value = product.category;
    imageInput.value = product.image;
    descriptionInput.value = product.description;
  };
  const updateBtn = document.createElement("button");
  const btn = addProductForm.querySelector("#add-btn");
  btn.style.display = "none";
  updateBtn.textContent = "Update";
  updateBtn.className = "btn btn-warning";
  updateBtn.type = "button";
  addProductForm.appendChild(updateBtn);
  if (updateBtn.type == "button") {
    updateBtn.addEventListener("click", () => {
      const newTitle = titleInput.value;
      const newPrice = priceInput.value;
      const newCategory = categorySelect.value;
      const newImage = imageInput.value;
      const newDescription = descriptionInput.value;
      const Product = {
        title: newTitle,
        price: newPrice,
        category: newCategory,
        image: newImage,
        description: newDescription,
      };
      const updateProduct = async () => {
        try {
          const response = await fetch(`${API_URL}/products/${id}`, {
            method: "PATCH",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify(Product),
          });
          if (!response.ok) {
            throw new Error("Can't update this product");
          }
          const data = await response.json();
          console.log(data);
          fetchProducts();
        } catch (error) {
          console.error(error);
        } finally {
          updateBtn.style.display = "none";
          btn.style.display = "block";
          titleInput.value = "";
          priceInput.value = "";
          imageInput.value = "";
          descriptionInput.value = "";
        }
      };
      updateProduct();
    });
  }
  getProductData(id);

  // Hint for the lesson:
  // 1. Fetch the product by id to populate the form
  // 2. Change the form submit handler to do a PUT/PATCH request
  // 3. fetch(`${API_URL}/products/${id}`, { method: 'PUT', ... })
  // 4. fetchProducts() again to refresh list
};

// -------------------------------------------------------------------
// ORDER MANAGEMENT (Admin Panel)
// -------------------------------------------------------------------

const fetchOrders = async () => {
  try {
    const response = await fetch(`${API_URL}/orders`);
    if (!response.ok) {
      throw new Error(`Failed to fetch orders: ${response.status}`);
    }

    const orders = await response.json();
    renderOrders(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    const ordersContainer = document.getElementById("orders-container");
    if (ordersContainer) {
      ordersContainer.innerHTML = `
        <div style="color: red; padding: 20px; text-align: center; grid-column: 1/-1;">
          Error loading orders. Make sure json-server is running.
        </div>
      `;
    }
  }
};

const renderOrders = (orders) => {
  const ordersCount = document.getElementById("orders-count");
  const ordersContainer = document.getElementById("orders-container");

  if (!ordersContainer) return;

  // Calculate admin revenue from paid orders
  let totalRevenue = 0;
  let totalPaidFromBalance = 0;

  orders.forEach((order) => {
    if (order.amountPaid) {
      totalRevenue += order.amountPaid;
      totalPaidFromBalance += order.amountPaid;
    }
  });

  // Update revenue display
  const revenueEl = document.getElementById("admin-revenue");
  const balanceConsumedEl = document.getElementById("admin-balance-consumed");
  if (revenueEl) revenueEl.textContent = `$${totalRevenue.toFixed(2)}`;
  if (balanceConsumedEl)
    balanceConsumedEl.textContent = `$${totalPaidFromBalance.toFixed(2)}`;

  // Filter out delivered orders (they disappear from admin view)
  const activeOrders = orders.filter((order) => order.status !== "delivered");

  // Update count (only active orders)
  ordersCount.textContent = `${activeOrders.length} order${activeOrders.length !== 1 ? "s" : ""}`;

  // Clear container
  ordersContainer.innerHTML = "";

  if (activeOrders.length === 0) {
    ordersContainer.innerHTML = `<div class="loader">No pending orders.</div>`;
    return;
  }

  // Create order cards
  activeOrders.forEach((order, index) => {
    const statusClass = `status-${order.status.toLowerCase()}`;
    const itemsHtml = order.items
      .map(
        (item) =>
          `<p style="margin: 4px 0; font-size: 13px;">• ${item.title} (x${item.quantity}) = $${(item.price * item.quantity).toFixed(2)}</p>`,
      )
      .join("");

    // Determine button states based on current status
    const isDeclined = order.status === "declined";
    const isAccepted = order.status === "accepted";
    const isShipping = order.status === "shipping";
    const isPending = order.status === "pending";

    const acceptBtnDisabled = !isPending;
    const declineBtnDisabled = !isPending;
    const shippingBtnDisabled = !isAccepted;
    const deliverBtnDisabled = !isShipping;

    const card = document.createElement("div");
    card.className = "order-card";
    card.style.cssText = `
      border: 1px solid #ddd;
      padding: 15px;
      margin-bottom: 15px;
      border-radius: 6px;
      background-color: #f9f9f9;
    `;

    card.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
        <div>
          <p style="margin: 0; font-weight: bold; font-size: 14px;">Order #${index + 1}</p>
          <p style="margin: 4px 0; font-size: 12px; color: #666;">Placed: ${new Date(order.createdAt).toLocaleDateString()}</p>
        </div>
        <span class="order-status ${statusClass}" style="
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
        ">${order.status}</span>
      </div>

      <div style="background-color: white; padding: 10px; border-radius: 4px; margin-bottom: 10px;">
        <p style="margin: 4px 0; font-size: 13px;"><strong>Customer:</strong> ${order.customerName}</p>
        <p style="margin: 4px 0; font-size: 13px;"><strong>Email:</strong> ${order.customerEmail}</p>
        <p style="margin: 4px 0; font-size: 13px;"><strong>Phone:</strong> ${order.customerPhone}</p>
        <p style="margin: 4px 0; font-size: 13px;"><strong>Address:</strong> ${order.customerAddress}</p>
      </div>

      <div style="background-color: white; padding: 10px; border-radius: 4px; margin-bottom: 10px;">
        <p style="margin: 0 0 5px 0; font-weight: 600; font-size: 13px;">Items:</p>
        ${itemsHtml}
      </div>

      <div style="background-color: #e8f4f8; padding: 10px; border-radius: 4px; margin-bottom: 12px; font-weight: bold; font-size: 14px;">
        Total: $${order.total.toFixed(2)}
      </div>

      ${
        order.amountPaid
          ? `
        <div style="background-color: #d4edda; padding: 10px; border-radius: 4px; margin-bottom: 12px; border-left: 4px solid #28a745;">
          <p style="margin: 4px 0; font-size: 12px;"><strong style="color: #155724;">💚 Paid from Client Balance: </strong>$${order.amountPaid.toFixed(2)}</p>
          ${order.amountRemaining > 0 ? `<p style="margin: 4px 0; font-size: 12px; color: #856404;"><strong>⚠️ Remaining Due: </strong>$${order.amountRemaining.toFixed(2)}</p>` : '<p style="margin: 4px 0; font-size: 12px; color: #155724;"><strong>✓ Fully Paid</strong></p>'}
        </div>
      `
          : ""
      }

      <div style="margin-bottom: 12px;">
        <label style="display: block; font-size: 12px; font-weight: 600; margin-bottom: 5px;">Admin Notes:</label>
        <textarea id="notes-${order.id}" style="
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 12px;
          font-family: inherit;
          min-height: 60px;
          resize: vertical;
        " placeholder="Add notes for customer...">${order.notes || ""}</textarea>
        <button class="btn btn-secondary" onclick="saveOrderNotes('${order.id}')" style="padding: 8px; font-size: 12px; margin-top: 8px; width: 100%; background-color: #6c757d; border-color: #6c757d;">
          💾 Save Notes
        </button>
        <div id="notes-feedback-${order.id}" style="margin-top: 5px; font-size: 12px; display: none;"></div>
      </div>

      ${
        order.replies && order.replies.length > 0
          ? `
        <div style="background-color: #e7f3ff; padding: 12px; border-radius: 4px; margin-bottom: 12px; border-left: 4px solid #0066cc;">
          <p style="margin: 0 0 10px 0; font-weight: 600; font-size: 13px; color: #0066cc;">💬 Client Replies:</p>
          ${order.replies
            .map(
              (reply) => `
            <div style="background-color: white; padding: 10px; margin-bottom: 8px; border-radius: 4px; border: 1px solid #b3d9ff;">
              <p style="margin: 0 0 5px 0; font-size: 12px; white-space: pre-wrap; color: #333;">${reply.text || "(no text)"}</p>
              ${reply.image ? `<img src="${reply.image}" style="max-width: 200px; margin-top: 8px; border-radius: 4px;">` : ""}
              <p style="margin: 5px 0 0 0; font-size: 11px; color: #666;">${new Date(reply.timestamp).toLocaleString()}</p>
            </div>
          `,
            )
            .join("")}
        </div>
      `
          : ""
      }

      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 8px; margin-bottom: 12px;">
        <button class="btn btn-primary" onclick="updateOrderStatus('${order.id}', 'accepted')" style="padding: 8px; font-size: 12px; cursor: ${acceptBtnDisabled ? "not-allowed" : "pointer"}; opacity: ${acceptBtnDisabled ? "0.5" : "1"};" ${acceptBtnDisabled ? "disabled" : ""}>
          ✓ Accept
        </button>
        <button class="btn btn-warning" onclick="updateOrderStatus('${order.id}', 'shipping')" style="padding: 8px; font-size: 12px; cursor: ${shippingBtnDisabled ? "not-allowed" : "pointer"}; opacity: ${shippingBtnDisabled ? "0.5" : "1"};" ${shippingBtnDisabled ? "disabled" : ""}>
          🚚 Ship
        </button>
        <button class="btn btn-success" onclick="updateOrderStatus('${order.id}', 'delivered')" style="padding: 8px; font-size: 12px; background-color: #28a745; border-color: #28a745; cursor: ${deliverBtnDisabled ? "not-allowed" : "pointer"}; opacity: ${deliverBtnDisabled ? "0.5" : "1"};" ${deliverBtnDisabled ? "disabled" : ""}>
          ✓ Deliver
        </button>
        <button class="btn btn-danger" onclick="updateOrderStatus('${order.id}', 'declined')" style="padding: 8px; font-size: 12px; cursor: ${declineBtnDisabled ? "not-allowed" : "pointer"}; opacity: ${declineBtnDisabled ? "0.5" : "1"};" ${declineBtnDisabled ? "disabled" : ""}>
          ✗ Decline
        </button>
      </div>
    `;

    ordersContainer.appendChild(card);
  });
};

const updateOrderStatus = async (orderId, newStatus) => {
  try {
    const notesEl = document.getElementById(`notes-${orderId}`);
    const notes = notesEl ? notesEl.value : "";

    const response = await fetch(`${API_URL}/orders/${orderId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: newStatus,
        notes: notes,
        updatedAt: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update order status");
    }

    console.log(`Order ${orderId} updated to ${newStatus}`);
    fetchOrders(); // Refresh orders list
  } catch (error) {
    console.error("Error updating order:", error);
    alert("Failed to update order. Please try again.");
  }
};

// Save notes without changing status (can be pressed multiple times)
const saveOrderNotes = async (orderId) => {
  try {
    const notesEl = document.getElementById(`notes-${orderId}`);
    const feedbackEl = document.getElementById(`notes-feedback-${orderId}`);
    const notes = notesEl ? notesEl.value : "";

    const response = await fetch(`${API_URL}/orders/${orderId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        notes: notes,
        updatedAt: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to save notes");
    }

    // Show success feedback
    feedbackEl.textContent = "✓ Notes saved successfully!";
    feedbackEl.style.color = "#28a745";
    feedbackEl.style.display = "block";

    // Hide feedback after 2 seconds
    setTimeout(() => {
      feedbackEl.style.display = "none";
    }, 2000);

    console.log(`Notes saved for order ${orderId}`);
  } catch (error) {
    console.error("Error saving notes:", error);
    const feedbackEl = document.getElementById(`notes-feedback-${orderId}`);
    feedbackEl.textContent = "✗ Failed to save notes";
    feedbackEl.style.color = "#dc3545";
    feedbackEl.style.display = "block";
  }
};

// Initial Fetch on Page Load
fetchProducts();
fetchCategories();
fetchOrders();

// -------------------------------------------------------------------
// BOM Navigation, Preview, and Pop-up management (Admin)
// -------------------------------------------------------------------

const navigateToDetails = (productId) => {
  window.location.href = `details.html?id=${productId}`;
};
window.navigateToDetails = navigateToDetails;

// Dynamic popup close button inside pop-up admin window
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

window.addEventListener("scroll", () => {
  if (scrollY >= 600) {
    scrollToTopBtn.style.display = "block";
    scrollToTopBtn.addEventListener("click",
      handleScrollToTop
    );
  }else{
    scrollToTopBtn.style.display = "none";
  }
});
// @ handling the scroll to top btn
function handleScrollToTop() {
  scrollTo({
    top: 0,
    left:0,
    behavior: "smooth",
  });
}
//example of valid shipping address for client that succeeds: 123 Main St, Springfield, IL 62704
