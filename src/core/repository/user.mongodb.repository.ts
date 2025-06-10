import { UserEntity } from "../entity/user.entity.js";
import { UserRepository } from "./interface/user.repository.js";
import { UserSchema } from "../schema/user.mongodb.schema.js";
import { UserDocument } from "../schema/user.mongodb.schema.js";
import { UserMapper } from "./mapper/user.mapper.js";
import { UserFilter } from "./filters/user.filter.js";
import { MongodbRepository } from "./mongodb.repository.js";

class UserRepositoryMongodb 
extends MongodbRepository<UserEntity, UserDocument, string, UserFilter> 
implements UserRepository<UserEntity, string, UserFilter>
{   
    declare public readonly mapper: UserMapper

    constructor() {
        const userMapper = new UserMapper()
        super(UserSchema, "Users", userMapper)
        this.mapper = userMapper
    }

    public async findOneBy(condition: Partial<Omit<UserFilter, 'username' | 'createdAt' | 'updatedAt'>>): Promise<UserEntity | null> {
        return super.findOneBy(condition); // Caso contrário, executa a busca normalmente
    }
}

export { UserRepositoryMongodb };