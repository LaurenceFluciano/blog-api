import { UserAuthService } from "../../../core/services/Auth/user.auth.service.js";
import { Request, Response } from "express";
import { AuthTokenDTO, FilterUserUpdateDTO, UpdateUserDTO, UserAuthLoginDTO } from "../../dtos/auth.dto.js";
import { UnauthorizedError } from "../../../core/services/Error/validation.error.service.js";

export class UserAuthController {
    private service: UserAuthService;

    constructor(service: UserAuthService) {
        this.service = service;
    }

    async login(req: Request, res: Response) {
        const accessExpirein = req.query.accessExpirein as string
        const refreshExpirein = req.query.refreshExpirein as string
        const result: AuthTokenDTO = await this.service.login(new UserAuthLoginDTO(req.body.email,req.body.password),refreshExpirein,accessExpirein)
        res.status(200).json(result)
    }
    async profile(req: Request, res: Response) {
        const result = req.user
        res.status(200).json(result)
    }

    async refreshToken(req: Request, res: Response) {
        const accessExpirein = req.query.accessExpirein as string
        const authorization = req.headers.authorization;
        const result: AuthTokenDTO = await this.service.refreshToken(authorization,accessExpirein)
        res.status(200).json(result)
    }

    async updateProfile(req: Request, res: Response) {
        const updateFilters: UpdateUserDTO = {
            userID: req.user.id as string,
            password: req.body.password as string,
        }
        const filters = req.body as Partial<FilterUserUpdateDTO>;

        await this.service.update(
            new UpdateUserDTO(updateFilters.userID,updateFilters.password),
            new FilterUserUpdateDTO(filters.username,filters.email,filters.newPassword)
        )
 
        res.status(200).json({message: "Usuário atualizado com sucesso", refreshTokenRequired: true})
    }
}

