import "dotenv/config";
import cron from "node-cron";
import mongoose from "mongoose";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import Report from "../models/Report.js";
import Contractor from "../models/Contractor.js";
import { scrapeSoi } from "./soiScraper.js";
import { uploadToDrive } from "../utils/driveService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directorio donde se guardan los PDFs descargados
const DOWNLOADS_DIR = path.join(__dirname, "..", "downloads");

// Mapeo de plataformas a sus funciones scraper
const SCRAPER_MAP = {
    soi: scrapeSoi,
    // aportes_en_linea: scrapeAportesEnLinea,  // TODO
    // asopagos: scrapeAsopagos,                // TODO
    // mi_planilla: scrapeMiPlanilla,           // TODO
};

/**
 * Asegura que el directorio de descargas exista.
 */
const ensureDownloadsDir = () => {
    if (!fs.existsSync(DOWNLOADS_DIR)) {
        fs.mkdirSync(DOWNLOADS_DIR, { recursive: true });
        console.log(`📁 Directorio de descargas creado: ${DOWNLOADS_DIR}`);
    }
};

/**
 * Procesa todos los reportes pending de una plataforma específica.
 * Los procesa UNO POR UNO en orden de llegada (createdAt ascendente).
 *
 * @param {string} platform - Plataforma a procesar (ej: "soi")
 */
const processPendingReports = async (platform) => {
    const scraperFn = SCRAPER_MAP[platform];
    if (!scraperFn) {
        console.log(`⚠️  No hay scraper implementado para: ${platform}`);
        return;
    }

    // Buscar reportes pending de esta plataforma, ordenados por fecha de creación
    const pendingReports = await Report.find({
        status: "pending",
        platform,
    }).sort({ createdAt: 1 });

    if (pendingReports.length === 0) {
        return;
    }

    console.log(`\n📋 ${pendingReports.length} reporte(s) pending para ${platform}`);

    for (const report of pendingReports) {
        try {
            // Marcar como processing
            report.status = "processing";
            await report.save();

            // Obtener datos del contratista
            const contractor = await Contractor.findById(report.contractorId);
            if (!contractor) {
                throw new Error(`Contratista ${report.contractorId} no encontrado`);
            }

            // Preparar datos para el scraper
            const reportData = {
                contractor: {
                    documentType: contractor.documentType,
                    documentNumber: contractor.documentNumber,
                    eps: contractor.eps,
                    fullName: contractor.fullName,
                },
                platformData: report.platformData,
            };

            // Ejecutar scraper
            const result = await scraperFn(reportData, DOWNLOADS_DIR);

            if (result.success) {
                report.status = "success";
                report.filePath = result.filePath;
                report.errorReason = null;
                console.log(`✅ Reporte ${report._id} — PDF descargado`);

                // Subir a Google Drive
                try {
                    const { mes, anio } = report.platformData;
                    const driveResult = await uploadToDrive(
                        result.filePath,
                        contractor.fullName,
                        anio,
                        mes,
                        contractor.documentType,
                        contractor.documentNumber
                    );

                    report.driveFileId = driveResult.driveFileId;
                    report.driveUrl = driveResult.driveUrl;
                    report.status = "downloaded";
                    console.log(`☁️  Reporte ${report._id} — subido a Drive`);

                    // Eliminar PDF local después de subir
                    fs.unlinkSync(result.filePath);
                } catch (driveError) {
                    // Si falla Drive, el PDF local sigue disponible
                    console.error(`⚠️  Drive falló para ${report._id}: ${driveError.message}`);
                    // Status queda en 'success' con filePath local
                }
            } else {
                report.status = "error";
                report.errorReason = result.error;
                console.log(`❌ Reporte ${report._id} falló: ${result.error}`);
            }

            await report.save();
        } catch (error) {
            // Error no detiene los demás reportes
            report.status = "error";
            report.errorReason = error.message;
            await report.save();
            console.error(`❌ Error procesando reporte ${report._id}: ${error.message}`);
        }
    }
};

/**
 * Ciclo principal: procesa todas las plataformas que tengan scraper implementado.
 */
const runScraperCycle = async () => {
    console.log(`\n⏰ [${new Date().toLocaleTimeString()}] Iniciando ciclo de scraping...`);

    ensureDownloadsDir();

    for (const platform of Object.keys(SCRAPER_MAP)) {
        await processPendingReports(platform);
    }

    console.log(`✔️  Ciclo completado.\n`);
};

/**
 * Inicia el cron job para ejecutar el scraper cada 3 minutos.
 * Se usa desde index.js después de conectar a la BD.
 */
export const startScraperCron = () => {
    // Ejecutar cada 3 minutos
    cron.schedule("*/3 * * * *", async () => {
        try {
            await runScraperCycle();
        } catch (error) {
            console.error("🔴 Error en el ciclo de scraping:", error.message);
        }
    });

    console.log("🤖 Scraper cron iniciado — ejecutará cada 3 minutos");
};

/**
 * Modo standalone: ejecutar manualmente con `npm run scraper`.
 * Conecta a MongoDB, ejecuta un ciclo, y se desconecta.
 */
const isStandalone = process.argv[1] && process.argv[1].includes("scraperRunner");

if (isStandalone) {
    const runStandalone = async () => {
        try {
            await mongoose.connect(process.env.MONGO_URI);
            console.log("🟢 Conectado a MongoDB (modo standalone)");

            await runScraperCycle();
        } catch (error) {
            console.error("🔴 Error:", error.message);
        } finally {
            await mongoose.disconnect();
            console.log("🔌 Desconectado de MongoDB");
        }
    };

    runStandalone();
}
