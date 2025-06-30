import { isValidProduct } from "../helpers/validate.js";
import {
    getAllProducts,
    addProduct as insertProduct,
    updateProduct as updateProductQuery,
    deleteProduct as deleteProductQuery
} from "../Database/queries.js";

/**
 * Handles GET request to return all products.
 * @param {import("express").Request} req - The request object.
 * @param {import("express").Response} res - The response object.
 */
export const getProducts = (req, res) => {
    const products = getAllProducts();
    res.status(200).json(products);
};

/**
 * Handles POST request to create a new product.
 * Validates input and inserts the product into the database.
 * @param {import("express").Request} req - The request object.
 * @param {import("express").Response} res - The response object.
 */
export const createProduct = (req, res) => {
    const product = req.body;

    // Convert supplier ID to number
    product.supplier_id = parseInt(product.supplier_id);

    if (!isValidProduct(product)) {
        return res.status(400).json({ error: "Missing or invalid product data" });
    }

    insertProduct(product);
    res.status(201).json({ message: "Product created successfully" });
};

/**
 * Handles PUT request to update a product by ID.
 * Validates input and updates the product in the database.
 * @param {import("express").Request} req - The request object.
 * @param {import("express").Response} res - The response object.
 */
export const updateProduct = (req, res) => {
    const id = parseInt(req.params.id);
    const updated = req.body;

    // Convert supplier ID to number
    updated.supplier_id = parseInt(updated.supplier_id);

    if (!isValidProduct(updated)) {
        return res.status(400).json({ error: "Invalid product data" });
    }

    updateProductQuery(id, updated);
    res.json({ message: "Product updated successfully" });
};

/**
 * Handles DELETE request to remove a product by ID.
 * @param {import("express").Request} req - The request object.
 * @param {import("express").Response} res - The response object.
 */
export const deleteProduct = (req, res) => {
    const id = parseInt(req.params.id);
    deleteProductQuery(id);
    res.status(204).send(); // No content
};
