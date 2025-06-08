import { Request, Response } from "express";
import { UserService } from "../../core/services/user.service.js";
import { PostUserDTO, GetUserByIdDTO} from "../../api/dtos/user.dto.js";

export class UserController {
    private service: UserService;

    constructor(service: UserService) {
        this.service = service;
    }

    async getUserById(req: Request, res: Response) {
        const id = new GetUserByIdDTO(req.params.id).userId;
        const result = await this.service.getUserById(id);
        return res.status(200).json(result);
    }


    async createUser(req: Request, res: Response) {
        const body = req.body
        console.log(body)
        await this.service.createUser(new PostUserDTO(body.username,body.email,body.password))
        res.status(201).json({message: "Usuário criado com sucesso"})
    }
}

