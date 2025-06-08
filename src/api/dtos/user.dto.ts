import { BadRequestError } from "../../core/services/Error/validation.error.service.js";
import { isValidDate } from "../../core/services/validation/validation.date.js";

class PostUserDTO {
    constructor(
        public readonly username: string,
        public readonly email: string,
        public readonly password: string
    ){
        if (typeof this.username !== 'string') {
            throw new BadRequestError("Username inválido");
        }
        if (typeof this.email !== 'string') {
            throw new BadRequestError("Email inválido");
        }
        if (typeof this.password !== 'string') {
            throw new BadRequestError("Senha inválida");
        }
    }
}


class GetUserByIdDTO {
    constructor(
        public readonly userId: string,
    ){
        if(typeof this.userId !== 'string') {
            throw new BadRequestError("Id de usuário inválido");
        }
    }
}

class GetUserDTO {
    constructor(
        public readonly username: string,
        public readonly email: string ,
        public readonly userId?: string,
        public readonly imageURL?: string
    ){
        if(typeof this.username !== "string") {
            throw new BadRequestError("Nome de usuário não definido")
        }
        if(typeof this.email !== "string") {
            throw new BadRequestError("Email de usuário não está definido")
        }
        if (this.userId !== undefined  && typeof this.userId !== 'string') {
            throw new BadRequestError("O id do usuário é inválido");
        }
        if (this.imageURL !== undefined  && typeof this.imageURL !== 'string') {
            throw new BadRequestError("A URL da imagem de perfil é inválida");
        }
    }
}


export {PostUserDTO, GetUserDTO, GetUserByIdDTO}