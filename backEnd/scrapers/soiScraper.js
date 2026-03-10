import { chromium } from "playwright";
import path from "path";
import fs from "fs";
import AdmZip from "adm-zip";
import { randomDelay, humanType, humanClick, humanSelect } from "../utils/humanBehavior.js";

/**
 * Mapeo de tipos de documento del sistema a valores del <select> de SOI.
 */
const DOC_TYPE_MAP = {
    CC: "1",  // Cédula de ciudadanía
    CE: "6",  // Cédula de extranjería
    PA: "5",  // Pasaporte
    TI: "3",  // Tarjeta de identidad
};

const SOI_URL = "https://servicio.nuevosoi.com.co/soi/certificadoAportesCotizante.do";

/**
 * Mapeo RÍGIDO de nombres de EPS a valores del dropdown de SOI.
 * Los nombres deben coincidir EXACTAMENTE con lo que envía el frontend.
 */
const EPS_MAP = {
    "SANITAS": "128",  // EPS005 - SANITAS S.A.
    "SALUD TOTAL": "126",  // EPS002 - SALUD TOTAL
    "NUEVA EPS": "171",  // EPS037 - NUEVA E.P.S
    "COMPENSAR": "130",  // EPS008 - COMPENSAR EPS
    "SURA": "132",  // EPS010 - SURAMERICANA
    "FAMISANAR": "131",  // EPS009 - FAMISANAR
    "COOSALUD": "134",  // EPS016 - COOSALUD
    "MUTUAL SER": "192",  // EPS042 - MUTUAL SER
    "ALIANSALUD": "127",  // EPS001 - ALIANSALUD
    "COMFENALCO VALLE": "129",  // EPS006 - COMFENALCO VALLE
    "SOS": "133",  // EPS012 - COOMEVA (SOS)
    "CAJACOPI": "197",  // EPS048 - CAJACOPI
    "CAPITAL SALUD": "176",  // EPSS34 - CAPITAL SALUD
    "SAVIA SALUD": "175",  // EPSS33 - SAVIA SALUD
    "EMSSANAR": "168",  // EPS036 - EMSSANAR
};

/**
 * Busca el valor del dropdown de SOI para una EPS dada.
 * Búsqueda rígida: primero intenta match exacto, luego por inclusión.
 *
 * @param {string} epsName - Nombre de la EPS
 * @returns {string|null} Valor del dropdown o null
 */
const getEpsValue = (epsName) => {
    const normalized = epsName.trim().toUpperCase();

    // Match exacto
    if (EPS_MAP[normalized]) {
        return EPS_MAP[normalized];
    }

    // Buscar si el nombre contiene alguna clave conocida
    const key = Object.keys(EPS_MAP).find((k) => normalized.includes(k));
    if (key) {
        return EPS_MAP[key];
    }

    return null;
};

/**
 * Ejecuta el scraper de SOI para un reporte específico.
 * La URL lleva directo al formulario de certificados — todos los campos son visibles.
 *
 * Flujo:
 * 1. Llenar aportante (tipo doc + número)
 * 2. Llenar cotizante (tipo doc + número) — mismos datos para independientes
 * 3. Seleccionar EPS, Mes, Año
 * 4. Click "Descargar PDF"
 *
 * @param {Object} report - Datos del reporte con contractor populado
 * @param {string} downloadDir - Ruta absoluta donde guardar el PDF
 * @returns {Promise<{ success: boolean, filePath?: string, error?: string }>}
 */
export const scrapeSoi = async (report, downloadDir) => {
    const { contractor, platformData } = report;
    const { documentType, documentNumber, eps } = contractor;
    const { mes, anio } = platformData;

    // Resolver EPS ANTES de abrir el navegador — si no existe, no gastar recursos
    const epsValue = getEpsValue(eps);
    if (!epsValue) {
        const available = Object.keys(EPS_MAP).join(", ");
        console.error(`   ❌ EPS "${eps}" no reconocida. Opciones: ${available}`);
        return { success: false, error: `EPS "${eps}" no reconocida. Usa: ${available}` };
    }

    let browser = null;

    try {
        console.log(`\n🔍 SOI Scraper — Doc: ${documentType} ${documentNumber}`);
        console.log(`   EPS: ${eps} → valor SOI: ${epsValue} | Periodo: ${mes}/${anio}`);

        // 1. Lanzar navegador
        browser = await chromium.launch({
            headless: false, // false para debug, cambiar a true en producción
        });

        const context = await browser.newContext({
            acceptDownloads: true,
            viewport: { width: 1280, height: 720 },
        });

        const page = await context.newPage();

        // 2. Navegar al formulario (llega directo, sin botones intermedios)
        console.log("   📄 Navegando a SOI...");
        await page.goto(SOI_URL, { waitUntil: "networkidle" });
        await randomDelay(1500, 2500);

        // 3. Llenar datos del APORTANTE (sección superior)
        console.log("   ✏️  Llenando datos del aportante...");
        const docTypeValue = DOC_TYPE_MAP[documentType] || "1";
        await humanSelect(page, "#tipoDocumentoAportante", docTypeValue);
        await humanType(page, 'input[name="numeroDocumentoAportante"]', documentNumber);

        // 4. Llenar datos del COTIZANTE (sección inferior, mismos datos para independientes)
        console.log("   ✏️  Llenando datos del cotizante...");
        await humanSelect(page, "#tipoDocumentoCotizante", docTypeValue);
        await humanType(page, "#numeroDocumentoCotizante", documentNumber);

        // 5. Seleccionar EPS con valor rígido
        console.log(`   🏥 Seleccionando EPS: ${eps} (${epsValue})...`);
        await humanSelect(page, "#administradoraSalud", epsValue);

        // 6. Seleccionar Mes y Año
        console.log(`   📅 Seleccionando periodo: ${mes}/${anio}...`);
        await humanSelect(page, "#periodoLiqSaludMes", String(parseInt(mes)));
        await humanSelect(page, "#periodoLiqSaludAnnio", String(anio));

        // 7. Click en "Descargar PDF"
        console.log("   📥 Descargando PDF...");
        await randomDelay(800, 1500);

        // Interceptar la descarga
        const [download] = await Promise.all([
            page.waitForEvent("download", { timeout: 30000 }),
            page.click("button:has-text('Descargar PDF')"),
        ]);

        // 8. Guardar el archivo descargado (SOI descarga un ZIP)
        const zipFileName = `${documentType}_${documentNumber}_${anio}_${mes}.zip`;
        const zipPath = path.join(downloadDir, zipFileName);
        await download.saveAs(zipPath);

        console.log(`   📦 ZIP guardado temporalmente en: ${zipPath}`);

        // 9. Extraer el PDF del ZIP
        const zip = new AdmZip(zipPath);
        const zipEntries = zip.getEntries();

        let pdfFileName = zipEntries.find(entry => entry.entryName.toLowerCase().endsWith('.pdf'))?.entryName;

        if (!pdfFileName) {
            throw new Error("No se encontró ningún archivo PDF dentro del ZIP descargado de SOI.");
        }

        // Extraer a la misma carpeta
        zip.extractAllTo(downloadDir, true);

        // Renombrar el PDF extraído a nuestro formato
        const extractedPdfPath = path.join(downloadDir, pdfFileName);
        const finalFileName = `${documentType}_${documentNumber}_${anio}_${mes}.pdf`;
        const finalFilePath = path.join(downloadDir, finalFileName);

        // Si el finalFilePath ya existe, borrarlo primero
        if (fs.existsSync(finalFilePath)) {
            fs.unlinkSync(finalFilePath);
        }

        fs.renameSync(extractedPdfPath, finalFilePath);

        // Limpiar el ZIP temporal
        fs.unlinkSync(zipPath);

        console.log(`   ✅ PDF extraído y guardado en: ${finalFilePath}`);

        await browser.close();

        return { success: true, filePath: finalFilePath };
    } catch (error) {
        console.error(`   ❌ Error en SOI Scraper: ${error.message}`);

        if (browser) {
            await browser.close().catch(() => { });
        }

        return { success: false, error: error.message };
    }
};
