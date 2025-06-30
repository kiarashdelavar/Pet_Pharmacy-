document.addEventListener("DOMContentLoaded", async () => {
    const productSection = document.getElementById("product-section");

    try {
        const res = await fetch("http://localhost:3000/api/products");
        const data = await res.json();

        /**
         * Filter the fetched product list to only include featured items.
         * Currently, these are "Dog Vitamin" and "Cat Antibiotic".
         */
        const featured = data.filter(p =>
            ["Dog Vitamin", "Cat Antibiotic"].includes(p.name)
        );

        productSection.innerHTML = "<h2>Featured Products:</h2>";

        // create and append product cards to the DOM
        featured.forEach(p => {
            // Convert product name to lowercase with underscores for image file naming
            const imageName = p.name.toLowerCase().replace(/\s+/g, "_") + ".jpg";
            const imgPath = `../images/${imageName}`;

            const card = document.createElement("div");
            card.className = "product-card";
            card.innerHTML = `
                <img src="${imgPath}" alt="${p.name}">
                <h3>${p.name}</h3>
                <p><strong>Description:</strong> ${p.description}</p>
                <p><strong>Price:</strong> €${p.price.toFixed(2)}</p>
                <p><strong>Stock:</strong> ${p.stock}</p>
                <p><strong>Supplier:</strong> ${p.supplier_name}</p>
            `;
            productSection.appendChild(card);
        });
    } catch (err) {
        productSection.innerHTML = `<p style="color:red;">Failed to load featured products: ${err.message}</p>`;
    }
});
