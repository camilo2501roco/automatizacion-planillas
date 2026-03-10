import { Schema, model } from "mongoose";

const reportSchema = new Schema(
    {
        contractorId: {
            type: Schema.Types.ObjectId,
            ref: "Contractor",
            required: [true, "El ID del contratista es obligatorio"],
        },
        platform: {
            type: String,
            required: [true, "La plataforma es obligatoria"],
            enum: {
                values: ["soi", "aportes_en_linea", "asopagos", "mi_planilla"],
                message: "La plataforma '{VALUE}' no es válida. Usa: soi, aportes_en_linea, asopagos o mi_planilla",
            },
        },
        platformData: {
            type: Schema.Types.Mixed,
            required: [true, "Los datos de la plataforma son obligatorios"],
        },
        status: {
            type: String,
            required: true,
            enum: {
                values: ["pending", "processing", "success", "downloaded", "error"],
                message: "El estado '{VALUE}' no es válido",
            },
            default: "pending",
        },
        errorReason: {
            type: String,
            default: null,
        },
        driveFileId: {
            type: String,
            default: null,
        },
        driveUrl: {
            type: String,
            default: null,
        },
        filePath: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

const Report = model("Report", reportSchema);

export default Report;
