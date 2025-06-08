import { BadRequestError } from "../Error/validation.error.service.js";

export function isValidDate(dateString: string): boolean {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
}

export function validateDate(date: string, field: string): void {
        if(date && !isValidDate(date as string)) {
            throw new BadRequestError(`Formato de data inválido no campo ${field}`);
        }
}