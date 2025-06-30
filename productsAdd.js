const API_PRODUCTS = "http://localhost:3000/api/products";
const API_SUPPLIERS = "http://localhost:3000/api/suppliers";

const form = document.getElementById("productForm");
const nameInput = document.getElementById("productName");
const descInput = document.getElementById("productDescription");
const categoryInput = document.getElementById("productCategory");
const supplierInput = document.getElementById("productSupplier");
const priceInput = document.getElementById("productPrice");
const stockInput = document.getElementById("productStock");
const idInput = document.getElementById("productId");
const message = document.getElementById("formMessage");
const cancelBtn = document.getElementById("cancelBtn");
const productTable = document.getElementById("productTableBody");

/**
 * Shows a message to the user inside the form message area.
 * @param {string} text - The message to show.
 * @param {string} [color="red"] - The color of the message text.
 */
function showMessage(text, color = "red") {
    message.textContent = text;
    message.style.color = color;
}

/**
 * Loads all suppliers from the server and fills the supplier dropdown.
 */
async function loadSuppliers() {
    try {
        const res = await fetch(API_SUPPLIERS);
        const data = await res.json();

        supplierInput.innerHTML = '<option value="">Select supplier</option>';

        data.forEach(s => {
            const opt = document.createElement("option");
            opt.value = s.id;
            opt.textContent = s.name;
            supplierInput.appendChild(opt);
        });
    } catch {
        showMessage("Failed to load suppliers");
    }
}

/**
 * Loads all products from the server and displays them in the table.
 * Also adds Edit and Delete buttons for each product.
 */
async function loadProducts() {
    try {
        const res = await fetch(API_PRODUCTS);
        const data = await res.json();

        productTable.innerHTML = "";

        if (!data.length) {
            productTable.innerHTML = "<tr><td colspan='6'>No products found.</td></tr>";
            return;
        }

        data.forEach(product => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td>${product.supplier_name}</td>
                <td>€${product.price.toFixed(2)}</td>
                <td>${product.stock}</td>
                <td>${product.description}</td>
                <td>
                    <button class="blue-btn" onclick="editProduct(${product.id})">Edit</button>
                    <button class="red-btn" onclick="deleteProduct(${product.id})">Delete</button>
                </td>
            `;

            // Save full product data for edit mode
            row.dataset.product = JSON.stringify(product);
            productTable.appendChild(row);
        });
    } catch {
        productTable.innerHTML = "<tr><td colspan='6' style='color:red;'>Failed to load products.</td></tr>";
    }
}

/**
 * Handles form submission for adding or editing a product.
 */
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Get form values
    const name = nameInput.value.trim();
    const description = descInput.value.trim();
    const category = categoryInput.value;
    const supplier_id = parseInt(supplierInput.value);
    const price = parseFloat(priceInput.value);
    const stock = parseInt(stockInput.value);
    const id = idInput.value;

    if (!name || !description || !category || !supplier_id || isNaN(price) || isNaN(stock)) {
        showMessage("All fields are required.");
        return;
    }

    const method = id ? "PUT" : "POST";
    const endpoint = id ? `${API_PRODUCTS}/${id}` : API_PRODUCTS;

    try {
        const res = await fetch(endpoint, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, description, category, supplier_id, price, stock })
        });

        if (!res.ok) throw new Error("Failed to save product");
        await res.json();

        showMessage(`Product ${id ? "updated" : "added"} successfully!`, "green");
        form.reset();
        idInput.value = "";
        await loadProducts();
    } catch (err) {
        showMessage(err.message);
    }
});

/**
 * Clears the form and resets the edit mode.
 */
cancelBtn.addEventListener("click", () => {
    form.reset();
    idInput.value = "";
    showMessage("Canceled.", "gray");
});

/**
 * Puts the form in edit mode and fills it with the selected product's data.
 * @param {number} id - The ID of the product to edit.
 */
window.editProduct = (id) => {
    const row = [...productTable.rows].find(r => JSON.parse(r.dataset.product).id === id);
    const product = JSON.parse(row.dataset.product);

    nameInput.value = product.name;
    descInput.value = product.description;
    categoryInput.value = product.category;
    supplierInput.value = product.supplier_id;
    priceInput.value = product.price;
    stockInput.value = product.stock;
    idInput.value = product.id;

    showMessage("Editing mode. Save or cancel.");
};

/**
 * Deletes a product by its ID after user confirms.
 * @param {number} id - The ID of the product to delete.
 */
window.deleteProduct = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
        const res = await fetch(`${API_PRODUCTS}/${id}`, { method: "DELETE" });
        if (res.status !== 204) throw new Error("Failed to delete");
        await loadProducts();
    } catch (err) {
        showMessage(`Delete error: ${err.message}`);
    }
};

loadSuppliers();
loadProducts();
