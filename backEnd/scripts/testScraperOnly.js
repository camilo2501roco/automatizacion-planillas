import { scrapeSoi } from "../scrapers/soiScraper.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const testScrapeOnly = async () => {
    const report = {
        contractor: {
            documentType: "CC",
            documentNumber: "1100971354",
            eps: "Sanitas"
        },
        platformData: {
            mes: "01",
            anio: "2026"
        }
    };

    const downloadDir = path.join(__dirname, "..", "downloads");
    if (!fs.existsSync(downloadDir)) {
        fs.mkdirSync(downloadDir);
    }

    console.log("Iniciando prueba de scraper (sin subir a Drive)...");
    const result = await scrapeSoi(report, downloadDir);

    if (result.success) {
        console.log("✅ Descarga exitosa:", result.filePath);
        const stats = fs.statSync(result.filePath);
        console.log(`📦 Tamaño del archivo: ${stats.size} bytes`);

        // Leer los primeros 100 caracteres para ver si es un PDF o HTML
        const buffer = Buffer.alloc(100);
        const fd = fs.openSync(result.filePath, 'r');
        fs.readSync(fd, buffer, 0, 100, 0);
        console.log("📄 Primeros bytes:");
        console.log(buffer.toString('utf8'));
        fs.closeSync(fd);
    } else {
        console.error("❌ Error en scraper:", result.error);
    }
};

testScrapeOnly();
