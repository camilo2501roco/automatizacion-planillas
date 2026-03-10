import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import { startScraperCron } from "./scrapers/scraperRunner.js";

// --- Inicialización ---
const app = express();
const PORT = process.env.PORT || 3000;

// --- Middlewares globales ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Rutas ---
import authRoutes from "./routes/authRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

app.use("/api/auth", authRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/dashboard", dashboardRoutes);

// --- Ruta de salud ---
app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// --- Middleware de errores global ---
app.use((err, _req, res, _next) => {
    console.error("🔴 Error:", err.message);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || "Error interno del servidor",
    });
});

// --- Conexión a DB e inicio del servidor ---
const startServer = async () => {
    await connectDB();

    // Iniciar cron de scrapers (cada 3 minutos)
    startScraperCron();

    app.listen(PORT, () => {
        console.log(`🟢 Servidor corriendo en http://localhost:${PORT}`);
    });
};

startServer();
