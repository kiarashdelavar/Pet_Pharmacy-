import db from './db.js';

/**
 * Gets all products with their supplier names.
 * @returns {Array<Object>} List of products with supplier info.
 */
export function getAllProducts() {
    return db.prepare(`
        SELECT
            products.*,
            suppliers.name AS supplier_name
        FROM products
                 JOIN suppliers ON products.supplier_id = suppliers.id
    `).all();
}

/**
 * Adds a new product to the database.
 * @param {Object} product - Product data.
 * @param {string} product.name
 * @param {string} product.description
 * @param {string} product.category
 * @param {number} product.supplier_id
 * @param {number} product.price
 * @param {number} product.stock
 * @returns {object} Result of the insert operation.
 */
export function addProduct(product) {
    const stmt = db.prepare(`
        INSERT INTO products (name, description, category, supplier_id, price, stock)
        VALUES (?, ?, ?, ?, ?, ?)
    `);
    return stmt.run(product.name, product.description, product.category, product.supplier_id, product.price, product.stock);
}

/**
 * Updates an existing product by ID.
 * @param {number} id - Product ID.
 * @param {Object} product - Updated product data.
 * @returns {object} Result of the update operation.
 */
export function updateProduct(id, product) {
    const stmt = db.prepare(`
        UPDATE products SET name = ?, description = ?, category = ?, supplier_id = ?, price = ?, stock = ?
        WHERE id = ?
    `);
    return stmt.run(product.name, product.description, product.category, product.supplier_id, product.price, product.stock, id);
}

/**
 * Deletes a product by its ID.
 * @param {number} id - Product ID.
 * @returns {object} Result of the delete operation.
 */
export function deleteProduct(id) {
    return db.prepare("DELETE FROM products WHERE id = ?").run(id);
}

/**
 * Gets all suppliers from the database.
 * @returns {Array<Object>} List of suppliers.
 */
export function getAllSuppliers() {
    return db.prepare("SELECT * FROM suppliers").all();
}

/**
 * Adds a new supplier.
 * @param {Object} supplier - Supplier data.
 * @param {string} supplier.name
 * @param {string} supplier.email
 * @returns {object} Result of the insert operation.
 */
export function addSupplier(supplier) {
    const stmt = db.prepare(`
        INSERT INTO suppliers (name, email)
        VALUES (?, ?)
    `);
    return stmt.run(supplier.name, supplier.email);
}

/**
 * Updates an existing supplier by ID.
 * @param {number} id - Supplier ID.
 * @param {Object} supplier - Updated supplier data.
 * @returns {object} Result of the update operation.
 */
export function updateSupplier(id, supplier) {
    const stmt = db.prepare(`
        UPDATE suppliers SET name = ?, email = ? WHERE id = ?
    `);
    return stmt.run(supplier.name, supplier.email, id);
}

/**
 * Deletes a supplier by ID.
 * @param {number} id - Supplier ID.
 * @returns {object} Result of the delete operation.
 */
export function deleteSupplier(id) {
    return db.prepare("DELETE FROM suppliers WHERE id = ?").run(id);
}

/**
 * Finds a supplier by their email (case-insensitive).
 * @param {string} email - Supplier email.
 * @returns {Object|undefined} Matching supplier or undefined.
 */
export function findSupplierByEmail(email) {
    return db.prepare("SELECT * FROM suppliers WHERE LOWER(email) = ?").get(email.toLowerCase());
}

/**
 * Finds a supplier by their ID.
 * @param {number} id - Supplier ID.
 * @returns {Object|undefined} Matching supplier or undefined.
 */
export function findSupplierById(id) {
    return db.prepare("SELECT * FROM suppliers WHERE id = ?").get(id);
}
