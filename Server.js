import express from "express";
import cors from "cors";
import productRoutes from "./routes/products.js";
import supplierRoutes from "./routes/suppliers.js";
import { globalErrorHandler } from "./helpers/errorHandler.js";

const app = express();
const PORT = 3000;
app.use(cors());
app.use(express.json());
app.use("/api/products", productRoutes);
app.use("/api/suppliers", supplierRoutes);

// is catching errors from any route
app.use(globalErrorHandler);

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
