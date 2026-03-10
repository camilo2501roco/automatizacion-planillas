import fs from "fs";
import path from "path";
import readline from "readline";
import { google } from "googleapis";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Caminos a las credenciales locales
const CREDENTIALS_PATH = path.join(__dirname, "..", "config", "oauth-credentials.json");
const TOKEN_PATH = path.join(__dirname, "..", "config", "drive-tokens.json");

// Define los permisos requeridos (Drive total para poder ver carpetas creadas manualmente)
const SCOPES = ["https://www.googleapis.com/auth/drive"];

/**
 * Script para autorizar la aplicación de Google Drive vía OAuth 2.0 y obtener un refresh_token
 */
async function authorize() {
    if (!process.env.GOOGLE_OAUTH_CREDENTIALS) {
        console.error(`❌ La variable GOOGLE_OAUTH_CREDENTIALS no existe en tu .env.`);
        console.log("   Debes pegar el contenido del JSON 'ID de cliente de OAuth' allí primero.");
        process.exit(1);
    }

    const credentials = JSON.parse(process.env.GOOGLE_OAUTH_CREDENTIALS);
    const { client_secret, client_id, redirect_uris } = credentials.installed || credentials.web;

    const oAuth2Client = new google.auth.OAuth2(
        client_id,
        client_secret,
        redirect_uris[0] || "http://localhost" // Redirección por defecto
    );

    // Si ya existe el token, no hay que hacer nada
    if (fs.existsSync(TOKEN_PATH)) {
        console.log("✅ Tu aplicación ya está autenticada (el archivo drive-tokens.json ya existe).");
        return;
    }

    getAccessToken(oAuth2Client);
}

/**
 * Pide al usuario que visite una URL, apruebe la app y pegue el código.
 */
function getAccessToken(oAuth2Client) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: "offline", // IMPORTANTE: pide el refresh_token
        scope: SCOPES,
        prompt: "consent", // Fuerza a pedir consenimiento de nuevo si es necesario
    });

    console.log("\n===========================================");
    console.log("⚠️ AUTORIZACIÓN REQUERIDA PARA GOOGLE DRIVE");
    console.log("===========================================\n");
    console.log("1. Autoriza esta aplicación abriendo esta URL en tu navegador:\n");
    console.log(`➡️  ${authUrl}\n`);
    console.log("2. Inicia sesión con el @gmail.com que agregaste como Usuario de Prueba.");
    console.log("   (Si te sale una advertencia de seguridad, haz click en 'Avanzado' y 'Ir a Automatización (no seguro)')");
    console.log("3. Acepta los permisos de Google Drive.");
    console.log("4. Serás redirigido a http://localhost/?code=EL_CODIGO_AQUI...");
    console.log("   Copia SOLAMENTE lo que está después de '?code=' y antes de '&scope='");
    console.log("\n===========================================\n");

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    rl.question("Pega el CÓDIGO aquí y presiona Enter: ", (code) => {
        rl.close();

        // Limpiamos el código en caso de que haya pegado la URL completa por error
        try {
            if (code.includes('code=')) {
                code = new URL(code).searchParams.get('code');
            }
        } catch (e) { }

        oAuth2Client.getToken(code.trim(), (err, token) => {
            if (err) {
                console.error("❌ Error recuperando el access token:", err.response?.data?.error_description || err.message);
                return;
            }

            oAuth2Client.setCredentials(token);

            // Verificamos si Google nos dio el refresh_token
            if (!token.refresh_token) {
                console.warn("\n⚠️ AVISO: Google no entregó un 'refresh_token'.");
                console.warn("   Esto pasa si ya habías autorizado la app antes.");
                console.warn("   Si el bot falla después de 1 hora, deberás ir a https://myaccount.google.com/permissions");
                console.warn("   quitarle el acceso a la app, y correr este script de nuevo.");
            }

            console.log(`\n🎉 ¡Autenticación exitosa!`);
            console.log("\n===========================================");
            console.log("Copia la siguiente línea y pégala en tu archivo .env:");
            console.log("===========================================\n");
            console.log(`GOOGLE_DRIVE_TOKENS=${JSON.stringify(token)}\n`);
            console.log("   El Scraper ya puede subir PDFs a tu Drive una vez que guardes el .env.");
        });
    });
}

// Ejecutar
authorize().catch(console.error);
