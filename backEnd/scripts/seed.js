import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Supervisor from "../models/Supervisor.js";

const SUPERVISORS = [
    {
        email: "admin@test.com",
        password: "123456",
        name: "Admin Prueba",
    },
];

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("🟢 Conectado a MongoDB");

        for (const sup of SUPERVISORS) {
            const exists = await Supervisor.findOne({ email: sup.email });
            if (exists) {
                console.log(`⚠️  Supervisor "${sup.email}" ya existe, se omite.`);
                continue;
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(sup.password, salt);

            await Supervisor.create({
                email: sup.email,
                password: hashedPassword,
                name: sup.name,
            });

            console.log(`✅ Supervisor "${sup.email}" creado correctamente.`);
        }

        console.log("\n🎉 Seed completado.");
    } catch (error) {
        console.error("🔴 Error en seed:", error.message);
    } finally {
        await mongoose.disconnect();
        console.log("🔌 Desconectado de MongoDB");
    }
};

seed();
