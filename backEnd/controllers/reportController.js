import { validationResult } from "express-validator";
import Contractor from "../models/Contractor.js";
import Report from "../models/Report.js";
import { validatePlatformData } from "../utils/platformValidator.js";

/**
 * POST /api/reports
 * Endpoint público: recibe datos del formulario del contratista,
 * busca o crea el Contractor, y crea un Report con status: pending.
 */
export const submitReport = async (req, res, next) => {
    try {
        // 1. Verificar errores de validación de campos comunes
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array(),
            });
        }

        const { documentType, documentNumber, fullName, eps, platform, platformData } = req.body;

        // 2. Validar campos específicos de la plataforma
        const platformValidation = validatePlatformData(platform, platformData);
        if (!platformValidation.valid) {
            return res.status(400).json({
                success: false,
                message: platformValidation.message,
                missingFields: platformValidation.missing,
            });
        }

        // 3. Buscar o crear el Contractor (upsert por documentType + documentNumber)
        const contractor = await Contractor.findOneAndUpdate(
            { documentType, documentNumber },
            { fullName, eps },
            { upsert: true, new: true, runValidators: true }
        );

        // 4. Crear el Report con status: pending
        const report = await Report.create({
            contractorId: contractor._id,
            platform,
            platformData,
            status: "pending",
        });

        // 5. Responder con confirmación
        res.status(201).json({
            success: true,
            message: "Reporte creado correctamente. Estado: pendiente.",
            report: {
                id: report._id,
                platform: report.platform,
                status: report.status,
                createdAt: report.createdAt,
            },
        });
    } catch (error) {
        next(error);
    }
};
