import { google } from "googleapis";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SCOPES = ["https://www.googleapis.com/auth/drive"];
const ROOT_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID;

/**
 * Crea un cliente autenticado de Google Drive vía OAuth2.
 * @returns {import('googleapis').drive_v3.Drive}
 */
const getDriveClient = () => {
    // 1. Leer credenciales OAuth2
    const credentialsPath = path.resolve(__dirname, "..", "config", "oauth-credentials.json");
    if (!fs.existsSync(credentialsPath)) {
        throw new Error(`Falta archivo de credenciales: ${credentialsPath}`);
    }
    const credentials = JSON.parse(fs.readFileSync(credentialsPath, "utf-8"));
    const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web;

    const oAuth2Client = new google.auth.OAuth2(
        client_id,
        client_secret,
        redirect_uris[0] || "http://localhost"
    );

    // 2. Cargar token guardado
    const tokenPath = path.resolve(__dirname, "..", "config", "drive-tokens.json");
    if (!fs.existsSync(tokenPath)) {
        throw new Error(`Falta el token OAuth. Ejecuta: node scripts/setupDriveAuth.js`);
    }

    const token = JSON.parse(fs.readFileSync(tokenPath, "utf-8"));
    oAuth2Client.setCredentials(token);

    return google.drive({ version: "v3", auth: oAuth2Client });
};

/**
 * Busca una carpeta por nombre dentro de un padre.
 * Si no existe, la crea.
 *
 * @param {import('googleapis').drive_v3.Drive} drive
 * @param {string} folderName - Nombre de la carpeta
 * @param {string} parentId - ID de la carpeta padre
 * @returns {Promise<string>} ID de la carpeta
 */
const findOrCreateFolder = async (drive, folderName, parentId) => {
    // Buscar si existe
    const response = await drive.files.list({
        q: `name='${folderName}' and '${parentId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
        fields: "files(id, name)",
        supportsAllDrives: true,
        includeItemsFromAllDrives: true,
    });

    if (response.data.files.length > 0) {
        return response.data.files[0].id;
    }

    // Crear carpeta
    const folder = await drive.files.create({
        requestBody: {
            name: folderName,
            mimeType: "application/vnd.google-apps.folder",
            parents: [parentId],
        },
        fields: "id",
        supportsAllDrives: true,
    });

    console.log(`   📁 Carpeta "${folderName}" creada en Drive`);
    return folder.data.id;
};

/**
 * Genera el nombre del archivo para Drive: nombre_apellido.pdf
 * Ejemplo: "Yurley Tatiana Bernal Porras" → "bernal_porras_yurley_tatiana.pdf"
 *
 * @param {string} fullName - Nombre completo del contratista
 * @returns {string} Nombre formateado
 */
const formatFileName = (fullName, documentType, documentNumber) => {
    if (!fullName) {
        return `${documentType}_${documentNumber}.pdf`.toLowerCase();
    }
    const parts = fullName.trim().toLowerCase().split(/\s+/);

    if (parts.length >= 4) {
        // Asume: nombre1 nombre2 apellido1 apellido2
        const [n1, n2, a1, a2] = parts;
        return `${a1}_${a2}_${n1}_${n2}.pdf`;
    } else if (parts.length === 3) {
        const [n1, a1, a2] = parts;
        return `${a1}_${a2}_${n1}.pdf`;
    } else if (parts.length === 2) {
        const [n1, a1] = parts;
        return `${a1}_${n1}.pdf`;
    }

    return `${parts.join("_")}.pdf`;
};

/**
 * Sube un PDF a Google Drive con la estructura: Año / Mes / nombre_apellido.pdf
 * Crea las carpetas si no existen.
 *
 * @param {string} localFilePath - Ruta absoluta del PDF local
 * @param {string} fullName - Nombre completo del contratista
 * @param {string} year - Año (ej: "2026")
 * @param {string} month - Mes (ej: "01")
 * @returns {Promise<{ driveFileId: string, driveUrl: string }>}
 */
export const uploadToDrive = async (localFilePath, fullName, year, month, documentType, documentNumber) => {
    const drive = getDriveClient();

    // 1. Crear/encontrar carpeta del Año
    console.log(`   ☁️  Subiendo a Drive: ${year}/${month}/...`);
    const yearFolderId = await findOrCreateFolder(drive, String(year), ROOT_FOLDER_ID);

    // 2. Crear/encontrar carpeta del Mes dentro del Año
    const monthPadded = String(month).padStart(2, "0");
    const monthFolderId = await findOrCreateFolder(drive, monthPadded, yearFolderId);

    // 3. Generar nombre del archivo
    const fileName = formatFileName(fullName, documentType, documentNumber);

    // 4. Subir el PDF
    const fileMetadata = {
        name: fileName,
        parents: [monthFolderId],
    };

    const media = {
        mimeType: "application/pdf",
        body: fs.createReadStream(localFilePath),
    };

    const file = await drive.files.create({
        requestBody: fileMetadata,
        media,
        fields: "id, webViewLink",
        supportsAllDrives: true,
    });

    const driveFileId = file.data.id;
    const driveUrl = file.data.webViewLink;

    console.log(`   ✅ Subido a Drive: ${year}/${monthPadded}/${fileName}`);
    console.log(`   🔗 ${driveUrl}`);

    return { driveFileId, driveUrl };
};
