document.addEventListener("DOMContentLoaded", () => {
    const API_URL = "http://localhost:3000/api/suppliers";

    const form = document.getElementById("supplierForm");
    const nameInput = document.getElementById("supplierName");
    const emailInput = document.getElementById("supplierEmail");
    const idInput = document.getElementById("supplierId");
    const message = document.getElementById("formMessage");
    const cancelBtn = document.getElementById("cancelEditBtn");
    const supplierList = document.getElementById("supplierList");

    /**
     * Shows a message to the user (e.g. success or error).
     * @param {string} text - The message to display.
     * @param {string} [color="red"] - The text color (default is red).
     */
    const showMessage = (text, color = "red") => {
        message.textContent = text;
        message.style.color = color;
    };

    /**
     * Loads all suppliers from the server and displays them in a table.
     */
    const loadSuppliers = async () => {
        try {
            const res = await fetch(API_URL);
            const data = await res.json();
            supplierList.innerHTML = "";

            data.forEach(supplier => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${supplier.name}</td>
                    <td>${supplier.email}</td>
                    <td>
                        <button class="blue-btn" onclick="editSupplier(${supplier.id}, '${supplier.name}', '${supplier.email}')">Edit</button>
                        <button class="red-btn" onclick="deleteSupplier(${supplier.id})">Delete</button>
                    </td>
                `;
                supplierList.appendChild(row);
            });
        } catch {
            supplierList.innerHTML = `<tr><td colspan="3" style="color:red;">Failed to load suppliers.</td></tr>`;
        }
    };

    /**
     * Handles the supplier form submission for adding or editing.
     * Sends a POST for new suppliers or PUT for existing ones.
     * @param {SubmitEvent} e - The form submit event.
     */
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const id = idInput.value;

        if (!name || !email) {
            showMessage("Both fields are required.");
            return;
        }

        const isEdit = !!id;
        const method = isEdit ? "PUT" : "POST";
        const endpoint = isEdit ? `${API_URL}/${id}` : API_URL;

        try {
            const res = await fetch(endpoint, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Server error");
            }

            await res.json();
            showMessage(`Supplier ${isEdit ? "updated" : "added"} successfully.`, "green");
            form.reset();
            await loadSuppliers();
            idInput.value = "";
        } catch (err) {
            showMessage(err.message);
        }
    });

    /**
     * Cancels the edit mode and resets the form.
     */
    cancelBtn.addEventListener("click", () => {
        form.reset();
        idInput.value = "";
        showMessage("Canceled.", "gray");
    });

    /**
     * Fills the form with supplier data to edit it.
     * @param {number} id - Supplier ID.
     * @param {string} name - Supplier name.
     * @param {string} email - Supplier email.
     */
    window.editSupplier = (id, name, email) => {
        nameInput.value = name;
        emailInput.value = email;
        idInput.value = id;
        showMessage("Editing mode. Save or cancel.");
    };

    /**
     * Deletes a supplier after asking for confirmation.
     * @param {number} id - Supplier ID to delete.
     */
    window.deleteSupplier = async (id) => {
        if (!confirm("Are you sure you want to delete this supplier?")) return;
        try {
            const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
            if (res.status !== 204) throw new Error("Failed to delete");
            await loadSuppliers();
        } catch (err) {
            showMessage(`Delete error: ${err.message}`);
        }
    };

    loadSuppliers();
});
