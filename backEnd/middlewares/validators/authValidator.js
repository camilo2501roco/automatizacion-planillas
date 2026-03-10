import { body } from "express-validator";

/**
 * Reglas de validación para login
 */
export const loginValidation = [
    body("email")
        .trim()
        .notEmpty().withMessage("El email es obligatorio")
        .isEmail().withMessage("El formato del email no es válido"),
    body("password")
        .notEmpty().withMessage("La contraseña es obligatoria"),
];

/**
 * Reglas de validación para cambio de contraseña
 */
export const changePasswordValidation = [
    body("currentPassword")
        .notEmpty().withMessage("La contraseña actual es obligatoria"),
    body("newPassword")
        .notEmpty().withMessage("La nueva contraseña es obligatoria")
        .isLength({ min: 6 }).withMessage("La nueva contraseña debe tener al menos 6 caracteres"),
];
