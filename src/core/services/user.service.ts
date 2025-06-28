import { UserRepository } from "../repository/interface/user.repository.js";
import { UserEntity } from "../entity/user.entity.js";
import { GetUserDTO, PostUserDTO} from "../../api/dtos/user.dto.js";
import { UserValidator } from "./validation/user.validation.js";
import { UserFilter, UserFilterFactory } from "../repository/filters/user.filter.js";
import { NotFoundError, ConflictError, BadRequestError } from "./Error/validation.error.service.js";
import { EncryptionService } from "./encryption/encryption.service.js";

export class UserService {
    

    public constructor(
        private readonly repository: UserRepository<UserEntity, string, UserFilter>,
        private readonly userValidators: UserValidator
    ) {}

    public async createUser(dto: PostUserDTO) {
        this.userValidators.email(dto.email)
        this.userValidators.username(dto.username)
        this.userValidators.password(dto.password)

        const username = dto.username.trim()
        const password = await EncryptionService.generateHash(dto.password)
        const email = dto.email

        const filters = new UserFilter()
        filters.email = dto.email.trim().toLowerCase()
        const existingUser = await this.repository.findOneBy(filters);
                
        if (existingUser) {
            throw new ConflictError("E-mail já está em uso.");
        }
                
        const newUser = new UserEntity(username, email, password);
        const user = await this.repository.create(newUser);
        if (!user) throw new BadRequestError("Erro ao criar o usuário!")
    }
    
    public async getUserById(id: string): Promise<GetUserDTO> {
        const userEntity = await this.repository.findById(id);
        if(!userEntity) throw new NotFoundError("Usuário não encontrado")
        return new GetUserDTO(userEntity.username,userEntity.email,userEntity.id)
    }

}