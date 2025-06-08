import { verifyJWT } from "../../../core/services/Tokens/verify.token.service.js";
import { Request, Response, NextFunction } from "express";
import { NotFoundError, UnauthorizedError } from "../../../core/services/Error/validation.error.service.js";

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) throw new UnauthorizedError("Token não fornecido");

    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
      throw new UnauthorizedError("Token mal formatado");
    }
    const token = parts[1]

    const decoded = await verifyJWT({ accessToken: token });

    if(decoded.type !== "access") throw new UnauthorizedError("Token inválido")

    req.user = decoded; 

    next();
  } catch (err) {
    next(err);
  }
}
