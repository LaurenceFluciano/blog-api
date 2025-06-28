import jwt from "jsonwebtoken";
import { AuthTokenDTO } from "../../../api/dtos/auth.dto.js";
import 'dotenv/config'

export function generatorJWT<T extends object>(
    payload: T, options?: jwt.SignOptions): any {
    return jwt.sign(payload, process.env.AUTH_JWT_TOKEN, options)
}