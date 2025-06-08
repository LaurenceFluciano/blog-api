import { HttpError } from "./error.service.js";

// factory pattern
function createHttpErrorClass(name: string, statusCode: number, defaultMessage: string) {
    return class extends HttpError {
        constructor(message?: string) {
            super(message || defaultMessage, statusCode);
            this.name = name;
        }
    }
}

export const BadRequestError = createHttpErrorClass("BadRequestError", 400, "Dados inválidos ou incompletos");
export const NotFoundError = createHttpErrorClass("NotFoundError", 404, "Não foi possível encontrar esse dado");
export const ConflictError = createHttpErrorClass("ConflictError", 409, "Conflito ao enviar os dados");
export const UnauthorizedError = createHttpErrorClass("UnauthorizedError", 401, "Credenciais erradas");