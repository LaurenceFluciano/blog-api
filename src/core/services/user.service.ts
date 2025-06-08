import { UserRepository } from "../repository/interface/user.repository.js";
import { UserEntity } from "../entity/user.entity.js";
import { GetUserDTO, PostUserDTO} from "../../api/dtos/user.dto.js";
import { UserValidator } from "./validation/user.validation.js";
import { UserFilter, UserFilterFactory } from "../repository/filters/user.filter.js";
import { NotFoundError, ConflictError } from "./Error/validation.error.service.js";
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

        const username = dto.username.trim().toLowerCase()
        const password = await EncryptionService.generateHash(dto.password)
        const email = dto.email

        const filters = new UserFilter()
        filters.email = email
        const filter = UserFilterFactory.create(filters);
        const existingUser = await this.repository.findOneBy(filter);
        
        if (existingUser) {
            throw new ConflictError("E-mail já está em uso.");
        }

        const newUser = new UserEntity(username, email, password);
        await this.repository.create(newUser);
    }
    
    public async getUserById(id: string): Promise<GetUserDTO> {
        const userEntity = await this.repository.findById(id);
        if(!userEntity) throw new NotFoundError("Usuário não encontrado")
        return new GetUserDTO(userEntity.username,userEntity.email,userEntity.id)
    }

}