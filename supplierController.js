import { isValidSupplier } from "../helpers/validate.js";
import {
    getAllSuppliers,
    addSupplier as insertSupplier,
    updateSupplier as updateSupplierQuery,
    deleteSupplier as deleteSupplierQuery,
    findSupplierById,
    findSupplierByEmail
} from "../Database/queries.js";

/**
 * Gets all suppliers from the database and sends them as JSON.
 * @param {import("express").Request} req - The request object.
 * @param {import("express").Response} res - The response object.
 */
export const getSuppliers = (req, res) => {
    const suppliers = getAllSuppliers();
    res.json(suppliers);
};

/**
 * Adds a new supplier to the database after validating data.
 * Also checks if the email is already used.
 * @param {import("express").Request} req - The request object.
 * @param {import("express").Response} res - The response object.
 */
export const addSupplier = (req, res) => {
    const supplier = req.body;

    // Check if name and valid email are provided
    if (!isValidSupplier(supplier)) {
        return res.status(400).json({ error: "Name and valid email are required." });
    }

    // Make sure email is not already taken
    const emailExists = findSupplierByEmail(supplier.email);
    if (emailExists) {
        return res.status(409).json({ error: "Email already exists." });
    }

    // Save the supplier
    insertSupplier({
        name: supplier.name.trim(),
        email: supplier.email.trim().toLowerCase(),
    });

    res.status(201).json({ message: "Supplier added successfully" });
};

/**
 * Updates an existing supplier by ID.
 * Checks if the supplier exists, validates input, and avoids duplicate emails.
 * @param {import("express").Request} req - The request object.
 * @param {import("express").Response} res - The response object.
 */
export const updateSupplier = (req, res) => {
    const id = parseInt(req.params.id);
    const existing = findSupplierById(id);

    // Check if the supplier exists
    if (!existing) return res.status(404).json({ error: "Supplier not found" });

    const { name, email } = req.body;

    // Validate name and email
    if (!isValidSupplier({ name, email })) {
        return res.status(400).json({ error: "Invalid name or email" });
    }

    const duplicate = findSupplierByEmail(email);
    if (duplicate && duplicate.id !== id) {
        return res.status(409).json({ error: "Another supplier already uses this email." });
    }

    // Save the updated supplier
    updateSupplierQuery(id, {
        name: name.trim(),
        email: email.trim().toLowerCase()
    });

    res.json({ message: "Supplier updated successfully" });
};

/**
 * Deletes a supplier by ID if it exists.
 * @param {import("express").Request} req - The request object.
 * @param {import("express").Response} res - The response object.
 */
export const deleteSupplier = (req, res) => {
    const id = parseInt(req.params.id);

    // Check if the supplier exists before deleting
    const supplier = findSupplierById(id);
    if (!supplier) return res.status(404).json({ error: "Supplier not found" });

    deleteSupplierQuery(id);
    res.status(204).send();
};
