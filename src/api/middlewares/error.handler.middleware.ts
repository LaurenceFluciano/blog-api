import { HttpError } from "../../core/services/Error/error.service.js"
import { Request, Response,NextFunction } from "express"

export function httpErrorHandler(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) {
    console.log("Estou capturando erros")
    if (err instanceof HttpError) {
        res.status(err.statusCode).json({
            error: true,
            message: err.message,
        });
    } else {
        console.error("[UNEXPECTED ERROR]", err);
        res.status(500).json({
            error: true,
            message: "Erro interno do servidor",
        });
    }
}