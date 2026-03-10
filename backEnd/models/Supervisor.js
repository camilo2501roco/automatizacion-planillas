import { Schema, model } from "mongoose";

const supervisorSchema = new Schema(
    {
        email: {
            type: String,
            required: [true, "El email es obligatorio"],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, "La contraseña es obligatoria"],
        },
        name: {
            type: String,
            required: [true, "El nombre es obligatorio"],
            trim: true,
        },
        googleDriveConfig: {
            type: Schema.Types.Mixed,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

const Supervisor = model("Supervisor", supervisorSchema);

export default Supervisor;
