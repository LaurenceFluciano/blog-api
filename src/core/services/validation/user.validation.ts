import { BadRequestError } from "../Error/validation.error.service.js";

interface UserValidationInterface {
    username(value: string): void;
    password(value: string): void;
    email(value: string): void;
}


export class UserValidator implements UserValidationInterface {
    public username(value: string) {
        const usernameRegex = /^[A-Za-z0-9_]{3,}$/;
        if(!usernameRegex.test(value)) {
            throw new BadRequestError("Nome de usuário inválido!");
        }
    }
    password(value: string, message: string ="Senha inválida"){
        const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[-_*&,.\!@#$%^&]).{6,}$/;
        if(!passwordRegex.test(value)) {
            throw new BadRequestError(message);
        }
    }
    email(value:string) {
        // Falta implementar muita coisa ainda *
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if(!emailRegex.test(value)) {
            throw new BadRequestError();
        }
    }
}
