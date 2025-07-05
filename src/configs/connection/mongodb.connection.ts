import dotenv from 'dotenv';
import mongoose from "mongoose";
dotenv.config()

export async function mongooseConnection() {
  try {
    await mongoose.connect(process.env.URI!);
    console.log("MongoDB conectado");
  } catch (err) {
    console.error("Erro ao conectar no Mongo:", err);
    throw err;  // Repasse erro pra não mascarar
  }
}

export async function mongooseDisconnection(): Promise<void> {
    await mongoose.disconnect()
}