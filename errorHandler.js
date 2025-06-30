/**
 * This function handles any errors that happen in your app.
 * It shows the error in the console and sends a message back to the user.
 *
 * @param {Error} err - The error that happened.
 * @param {Object} req - The request from the user.
 * @param {Object} res - The response to the user.
 * @param {Function} next - To move to the next middleware.
 */
export const globalErrorHandler = (err, req, res, next) => {
    console.error(err.stack); //printing the error in the terminal
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Something went wrong!",
    });
};
