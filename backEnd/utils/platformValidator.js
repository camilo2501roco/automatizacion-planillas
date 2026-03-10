/**
 * Campos obligatorios de platformData por cada plataforma.
 * Centraliza las reglas de validación para mantener el controller limpio.
 */
const PLATFORM_FIELDS = {
    soi: {
        label: "SOI",
        required: ["mes", "anio"],
    },
    aportes_en_linea: {
        label: "Aportes en Línea",
        required: [
            "fechaExpedicion",
            "anioDesde",
            "mesDesde",
            "anioHasta",
            "mesHasta",
            "tipoAfiliado",
        ],
    },
    asopagos: {
        label: "Asopagos",
        required: ["tipoCertificado", "anio", "mes", "tipoReporte"],
    },
    mi_planilla: {
        label: "Compensar - Mi Planilla",
        required: [
            "numeroPlanilla",
            "diaPago",
            "mesPago",
            "anioPago",
            "mesSalud",
            "anioSalud",
            "valorTotal",
        ],
    },
};

/**
 * Valida que platformData contenga todos los campos obligatorios
 * según la plataforma seleccionada.
 *
 * @param {string} platform - Nombre de la plataforma (ej: "soi")
 * @param {Object} platformData - Datos específicos de la plataforma
 * @returns {{ valid: boolean, missing?: string[], platformLabel?: string }}
 */
export const validatePlatformData = (platform, platformData) => {
    const config = PLATFORM_FIELDS[platform];

    if (!config) {
        return { valid: false, missing: [], message: `Plataforma "${platform}" no reconocida.` };
    }

    if (!platformData || typeof platformData !== "object") {
        return { valid: false, missing: config.required, message: "platformData es obligatorio." };
    }

    const missing = config.required.filter(
        (field) => platformData[field] === undefined || platformData[field] === ""
    );

    if (missing.length > 0) {
        return {
            valid: false,
            missing,
            message: `Faltan campos obligatorios para ${config.label}: ${missing.join(", ")}`,
        };
    }

    return { valid: true };
};

export default PLATFORM_FIELDS;
