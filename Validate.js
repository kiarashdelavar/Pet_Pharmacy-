/**
 * Checks if an email is valid.
 *
 * @param {string} email - The email you want to check.
 * @returns {boolean} True if it's a valid email, false if not.
 */
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
};

/**
 * Checks if a product object has valid data.
 *
 * @param {Object} product - The product to check.
 * @returns {boolean} True if it's valid, false if not.
 */
export const isValidProduct = ({ name, description, category, supplier_id, price, stock }) => {
    return (
        typeof name === "string" &&
        typeof description === "string" &&
        typeof category === "string" &&
        typeof supplier_id === "number" &&
        typeof price === "number" &&
        typeof stock === "number"
    );
};

/**
 * Checks if a supplier object has valid data.
 *
 * @param {Object} supplier - The supplier to check.
 * @returns {boolean} True if it's valid, false if not.
 */
export const isValidSupplier = ({ name, email }) => {
    return typeof name === "string" && isValidEmail(email);
};
