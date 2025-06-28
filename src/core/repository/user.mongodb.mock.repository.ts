import { UserEntity } from "../entity/user.entity.js";
import { UserFilter } from "./filters/user.filter.js";
import { UserRepository } from "./interface/user.repository.js";
import { MongodbRepositoryMock } from "./mongodb.mock.repository.js";

export class UserRepositoryMock
    extends MongodbRepositoryMock<UserEntity, string, UserFilter>
    implements UserRepository<UserEntity, string, UserFilter>
{
    public async findOneBy(condition: Partial<Omit<UserFilter, 'username' | 'createdAt' | 'updatedAt'>>): Promise<UserEntity | null> {
        return super.findOneBy(condition); 
    }
}
