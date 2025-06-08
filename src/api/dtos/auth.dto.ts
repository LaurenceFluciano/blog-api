import { BadRequestError } from "../../core/services/Error/validation.error.service.js";

class UserAuthLoginDTO {
    constructor(
        public readonly email: string,
        public readonly password: string
    ){}
}

class UserAuthResponseDTO {
    constructor(
        public readonly userId: string,
        public readonly email: string,
        public readonly username: string,
        public readonly createdAt?: Date,
        public readonly updatedAt?: Date
    ){}
}

class AuthTokenDTO {
  constructor(
    public readonly accessToken: string,
    public readonly refreshToken?: string
  ) {}
}

class UpdateUserDTO {
  constructor(
    public userID: string,
    public password: string
  ){
    if (typeof this.userID !== 'string' || this.userID.trim().length === 0) {
        throw new BadRequestError("ID do usuário é obrigatório.");
    }

    if (typeof this.password !== 'string' || this.password.trim().length === 0) {
        throw new BadRequestError("Senha é obrigatória.");
    }
  }
}

class FilterUserUpdateDTO {
    constructor(
        public username?: string,
        public email?: string,
        public newPassword?: string,
    ){
        if (this.username !== undefined  && typeof this.username !== 'string') {
            throw new BadRequestError("Username inválido");
        }
        if (this.email !== undefined  && typeof this.email !== 'string') {
            throw new BadRequestError("Email inválido");
        }
        if (this.newPassword !== undefined  && typeof this.newPassword !== 'string') {
            throw new BadRequestError("Senha inválido");
        }
    }
}


export {UserAuthLoginDTO,UserAuthResponseDTO,AuthTokenDTO,UpdateUserDTO, FilterUserUpdateDTO}