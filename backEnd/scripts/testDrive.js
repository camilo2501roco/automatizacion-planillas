import "dotenv/config";
import { uploadToDrive } from "../utils/driveService.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const testDrive = async () => {
    try {
        const testFile = path.join(__dirname, "..", "downloads", "CC_1100971354_2026_01.pdf");
        console.log("📁 Intentando subir:", testFile);

        const result = await uploadToDrive(testFile, "Yurley Tatiana Bernal Porras", "2026", "01");
        console.log("✅ Resultado:", result);
    } catch (error) {
        fs.writeFileSync("err.json", JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
        console.error("❌ Error guardado en err.json");
    }
};

testDrive();
