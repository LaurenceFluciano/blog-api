import jwt, { JwtPayload } from "jsonwebtoken";
import { AuthTokenDTO, UserAuthResponseDTO } from "../../../api/dtos/auth.dto.js";
import { UnauthorizedError } from "../Error/validation.error.service.js";
import 'dotenv/config'

export async function verifyJWT(token: AuthTokenDTO): Promise<JwtPayload> {
    try {
        const decoded = jwt.verify(token.accessToken, process.env.AUTH_JWT_TOKEN)

        if (typeof decoded === "string") throw new UnauthorizedError("Token inválido")
        

        return decoded as JwtPayload;
    } catch (err) {
        throw new UnauthorizedError("Token inválido ou expirado");
    }
}
export async function verifyRefreshJWT(token: AuthTokenDTO['refreshToken']): Promise<JwtPayload> {
    try {
        const decoded = jwt.verify(token, process.env.AUTH_JWT_TOKEN)

        if (typeof decoded === "string") throw new UnauthorizedError("Token inválido")
        if (!decoded || decoded.type !== "refresh") {
            throw new UnauthorizedError("Token inválido ou do tipo incorreto");
        }

        return decoded as JwtPayload;
    } catch (err) {
        throw new UnauthorizedError("Token inválido ou expirado");
    }
}