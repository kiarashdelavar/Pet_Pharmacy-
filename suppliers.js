/**
 * Loads all suppliers from the server and displays them in the table
 * after the page is fully loaded.
 */
document.addEventListener("DOMContentLoaded", async () => {
    const supplierTableBody = document.getElementById("supplierTableBody");
    const API_URL = "http://localhost:3000/api/suppliers";

    try {
        const res = await fetch(API_URL);
        const suppliers = await res.json();
        supplierTableBody.innerHTML = "";

        suppliers.forEach(supplier => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${supplier.name}</td>
                <td>${supplier.email}</td>
            `;
            supplierTableBody.appendChild(row);
        });
    } catch (err) {
        supplierTableBody.innerHTML = `<tr><td colspan="2" style="color:red;">Failed to load suppliers</td></tr>`;
    }
});
