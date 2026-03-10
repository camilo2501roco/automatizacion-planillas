import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import Supervisor from "../models/Supervisor.js";
import { generateToken } from "../utils/jwt.js";

/**
 * POST /api/auth/login
 * Autentica un supervisor y retorna un JWT.
 */
export const login = async (req, res, next) => {
    try {
        // Verificar errores de validación
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array(),
            });
        }

        const { email, password } = req.body;

        // Buscar supervisor por email
        const supervisor = await Supervisor.findOne({ email: email.toLowerCase() });
        if (!supervisor) {
            return res.status(401).json({
                success: false,
                message: "Credenciales incorrectas.",
            });
        }

        // Comparar contraseña
        const isMatch = await bcrypt.compare(password, supervisor.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Credenciales incorrectas.",
            });
        }

        // Generar token
        const token = generateToken({ id: supervisor._id, email: supervisor.email });

        res.json({
            success: true,
            token,
            supervisor: {
                id: supervisor._id,
                email: supervisor.email,
                name: supervisor.name,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * PUT /api/auth/password
 * Cambia la contraseña del supervisor autenticado.
 * Requiere authMiddleware.
 */
export const changePassword = async (req, res, next) => {
    try {
        // Verificar errores de validación
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array(),
            });
        }

        const { currentPassword, newPassword } = req.body;

        // Buscar supervisor autenticado
        const supervisor = await Supervisor.findById(req.supervisor.id);
        if (!supervisor) {
            return res.status(404).json({
                success: false,
                message: "Supervisor no encontrado.",
            });
        }

        // Verificar contraseña actual
        const isMatch = await bcrypt.compare(currentPassword, supervisor.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "La contraseña actual es incorrecta.",
            });
        }

        // Hashear nueva contraseña y guardar
        const salt = await bcrypt.genSalt(10);
        supervisor.password = await bcrypt.hash(newPassword, salt);
        await supervisor.save();

        res.json({
            success: true,
            message: "Contraseña actualizada correctamente.",
        });
    } catch (error) {
        next(error);
    }
};
