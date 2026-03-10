import "dotenv/config";
import mongoose from "mongoose";
import Report from "../models/Report.js";
import Contractor from "../models/Contractor.js";

const resetRealReport = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        // Buscar el contratista real
        const contractor = await Contractor.findOne({ documentNumber: "1100971354" });
        if (!contractor) {
            console.log("❌ Contratista no encontrado");
            return;
        }

        // Resetear solo su reporte
        const result = await Report.updateMany(
            { contractorId: contractor._id },
            { status: "pending", errorReason: null, filePath: null, driveFileId: null, driveUrl: null }
        );

        console.log(`✅ Reportes del contratista 1100971354 reseteados: ${result.modifiedCount}`);
    } catch (error) {
        console.error("🔴 Error:", error.message);
    } finally {
        await mongoose.disconnect();
    }
};

resetRealReport();
