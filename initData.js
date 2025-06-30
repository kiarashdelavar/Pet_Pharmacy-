import db from "../Database/db.js";

const seed = async () => {
    // enabling foreign key enforcement in SQLite
    await db.exec(`PRAGMA foreign_keys = ON;`);

    // create tables
    await db.exec(`
        CREATE TABLE IF NOT EXISTS suppliers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE
        );
    `);

    await db.exec(`
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT NOT NULL,
            category TEXT NOT NULL,
            supplier_id INTEGER NOT NULL,
            price REAL NOT NULL,
            stock INTEGER NOT NULL,
            FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
            );
    `);

    // insert supplier if not exists
    await db.exec(`
        INSERT INTO suppliers (name, email)
        SELECT 'Dr. Vet Supplier', 'vet@example.com'
            WHERE NOT EXISTS (
            SELECT 1 FROM suppliers WHERE email = 'vet@example.com'
        );
    `);

    // get supplier_id
    const supplier = db.prepare("SELECT id FROM suppliers WHERE email = ?").get("vet@example.com");

    // insert Dog Vitamin
    db.prepare(`
        INSERT INTO products (name, description, category, supplier_id, price, stock)
        SELECT ?, ?, ?, ?, ?, ?
        WHERE NOT EXISTS (
            SELECT 1 FROM products WHERE name = ?
        );
    `).run(
        "Dog Vitamin",
        "Strength booster for dogs",
        "Dog",
        supplier.id,
        15.99,
        10,
        "Dog Vitamin"
    );

    // insert Cat Antibiotic
    db.prepare(`
        INSERT INTO products (name, description, category, supplier_id, price, stock)
        SELECT ?, ?, ?, ?, ?, ?
        WHERE NOT EXISTS (
            SELECT 1 FROM products WHERE name = ?
        );
    `).run(
        "Cat Antibiotic",
        "Heals infections quickly",
        "Cat",
        supplier.id,
        12.49,
        8,
        "Cat Antibiotic"
    );

    console.log(" Database initialized successfully with featured products and supplier.");
};

seed();
