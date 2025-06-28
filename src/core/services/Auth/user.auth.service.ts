import { EncryptionService } from "../encryption/encryption.service.js";
import { AuthTokenDTO, UserAuthLoginDTO, UpdateUserDTO, FilterUserUpdateDTO } from "../../../api/dtos/auth.dto.js";
import { UserValidator } from "../validation/user.validation.js";
import { UserRepository } from "../../repository/interface/user.repository.js";
import { UserEntity } from "../../entity/user.entity.js";
import { UserFilter } from "../../repository/filters/user.filter.js";
import { BadRequestError, UnauthorizedError, ConflictError, NotFoundError } from "../Error/validation.error.service.js";
import { generatorJWT } from "../Tokens/generate.token.service.js";
import { StringValue } from "ms"
import { isValidRefreshExpireIn, isValidAccesExpireIn } from "../validation/auth.validation.js";
import { verifyRefreshJWT } from "../Tokens/verify.token.service.js";
import 'dotenv/config'
const DEFAULT_REFRESH_EXPIREIN = process.env.DEFAULT_REFRESH_EXPIREIN ?? '7d';
const DEFAULT_ACCESS_EXPIREIN = process.env.DEFAULT_ACCESS_EXPIREIN ?? '15m';

export class UserAuthService {
   
   
    public constructor( 
        private readonly repository: UserRepository<UserEntity, string, UserFilter>,
        private readonly userValidators: UserValidator    
    ) {}

    public async login(dto: UserAuthLoginDTO, refreshExpirein?: string, accessExpirein?: string): Promise<AuthTokenDTO> {
        if(!isValidRefreshExpireIn(refreshExpirein)) {
            refreshExpirein = DEFAULT_REFRESH_EXPIREIN
        }
         if(!isValidAccesExpireIn(accessExpirein)) {
            accessExpirein = DEFAULT_ACCESS_EXPIREIN
        }
        const refreshExpiresIn = refreshExpirein as StringValue
        const accessExpireIn = accessExpirein as StringValue

        this.userValidators.email(dto.email)
        this.userValidators.password(dto.password)

        const password = dto.password
        const email = dto.email

        const filter = new UserFilter()
        filter.email = email
        const user: UserEntity = await this.repository.findOneBy(filter);
        if(!user) {
            throw new UnauthorizedError("Usuário ou senha inválidos.");
        }

        const isValidPassword: boolean = await EncryptionService.comparePassword(password, user.password)
        if(!isValidPassword) {
            throw new UnauthorizedError("Usuário ou senha inválidos.");
        }



        const accessPayload = {
            id: user.id,
            email: user.email,
            username: user.username,
            type: "access"
        }
        const refreshPayload = {
            sub: user.id,
            type: "refresh"
        }

        return {
            accessToken: generatorJWT(accessPayload, { expiresIn: accessExpireIn }),
            refreshToken: generatorJWT(refreshPayload, { expiresIn: refreshExpiresIn })
        };
    }

    public async refreshToken(authorization: string, accessExpirein?: string): Promise<AuthTokenDTO>  {
        /** FALTA
         * Gerar e retornar refresh token novo junto com access token.
         * Guardar e validar jti do refresh token para evitar reuso.
         * Invalidar o refresh token usado (remover o jti antigo).
         */
        if(!isValidAccesExpireIn(accessExpirein)) {
            accessExpirein = DEFAULT_ACCESS_EXPIREIN
        }
        const accessExpireIn = accessExpirein as StringValue

        if(!authorization) throw new UnauthorizedError("Token não fornecido");
        const parts = authorization.split(" ");
        if (parts.length !== 2 || parts[0] !== "Bearer") {
            throw new UnauthorizedError("Token mal formatado");
        }
        const token = parts[1]

        const decoded = await verifyRefreshJWT(token);
        const userId = decoded.sub
        const user: UserEntity = await this.repository.findById(userId)

        if(!user) {
            throw new UnauthorizedError("Usuário não encontrado");
        }

        const accessPayload = {
            id: user.id,
            email: user.email,
            username: user.username,
            type: "access"
        } 

        return {
            accessToken: generatorJWT(accessPayload,{expiresIn: accessExpireIn})
        }

    }


    public async update(dto: UpdateUserDTO, filters: FilterUserUpdateDTO): Promise<void> {
        // Verificar se tem ao menos um filtro definido
        const hasValidFilter = Object.values(filters).some(value => value !== undefined);

        if (!hasValidFilter) {
            throw new BadRequestError("Nenhum dado válido para atualizar.");
        }

        this.userValidators.username(filters.username)
        // Procurar usuário e se ele sua senha é válida
        const userEntity = await this.repository.findById(dto.userID)
        if(!userEntity) throw new NotFoundError("Usuário não encontrado") 
        if (!(await EncryptionService.comparePassword(dto.password,userEntity.password))) 
        {
            throw new BadRequestError("Usuário ou senha inválido")
        }
       

        const updatedData: Partial<UserEntity> = {};

        if (filters.email) {
            const existingUser = await this.repository.findOneBy({ email: filters.email });
        
            if (existingUser && existingUser.id !== dto.userID) {
                throw new ConflictError("E-mail já está em uso.");
            }

            updatedData.email = filters.email;
        }
        if (filters.username) updatedData.username = filters.username;
        if (filters.newPassword) {
            this.userValidators.password(filters.newPassword, "Nova senha inválida. Use pelo menos 8 caracteres.")

            updatedData.password = await EncryptionService.generateHash(filters.newPassword);
        }
        
        await this.repository.update(updatedData,dto.userID)
    }
}