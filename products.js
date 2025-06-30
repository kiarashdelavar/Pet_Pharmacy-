/**
 * Loads all products from the server and shows only the ones
 * that match the selected filters (name, category, supplier).
 * It updates the table with the matching products.
 */
function loadProductsWithFilter() {
    const name = document.getElementById("filterName").value.trim().toLowerCase();
    const category = document.getElementById("filterCategory").value;
    const supplier = document.getElementById("filterSupplier").value;
    const tbody = document.getElementById("productList");

    fetch("http://localhost:3000/api/products")
        .then(res => res.json())
        .then(data => {
            tbody.innerHTML = "";

            // filtering products
            const filtered = data.filter(p => {
                const nameMatch = name === "" || p.name.toLowerCase().includes(name);
                const categoryMatch = category === "" || p.category === category;
                const supplierMatch = supplier === "" || p.supplier_id == supplier;
                return nameMatch && categoryMatch && supplierMatch;
            });

            if (!filtered.length) {
                tbody.innerHTML = "<tr><td colspan='7'>No matching products found.</td></tr>";
                return;
            }

            filtered.forEach(product => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${product.name}</td>
                    <td>${product.category}</td>
                    <td>${product.supplier_name}</td>
                    <td>€${product.price.toFixed(2)}</td>
                    <td>${product.stock}</td>
                    <td>${product.description}</td>
                `;
                tbody.appendChild(row);
            });
        })
        .catch(err => {
            tbody.innerHTML = `<tr><td colspan='7' style="color:red;">Error loading products: ${err.message}</td></tr>`;
        });
}

/**
 * Loads all suppliers from the server and fills the supplier dropdown
 * so users can filter products by supplier.
 */
function loadSuppliersForFilter() {
    const supplierDropdown = document.getElementById("filterSupplier");

    fetch("http://localhost:3000/api/suppliers")
        .then(res => res.json())
        .then(suppliers => {
            supplierDropdown.innerHTML = `<option value="">All</option>`;

            // Add each supplier to the dropdown
            suppliers.forEach(s => {
                const opt = document.createElement("option");
                opt.value = s.id;
                opt.textContent = s.name;
                supplierDropdown.appendChild(opt);
            });
        })
        .catch(() => {
            supplierDropdown.innerHTML = `<option value="">Failed to load</option>`;
        });
}

// When the "Apply Filter" button is clicked, run the filter function
document.getElementById("applyFilterBtn").addEventListener("click", loadProductsWithFilter);

// When the page loads, load products and fill the supplier dropdown
window.addEventListener("DOMContentLoaded", () => {
    loadProductsWithFilter();
    loadSuppliersForFilter();
});
