import dotenv from 'dotenv';
import mongoose from "mongoose";
dotenv.config()

export async function mongooseConnection() {
  mongoose.connect(process.env.URI!)
    .then(() => console.log("MongoDB conectado"))
    .catch((err) => console.error("Erro ao conectar no Mongo:", err));
}

export async function mongooseDisconnection(): Promise<void> {
    await mongoose.disconnect()
}